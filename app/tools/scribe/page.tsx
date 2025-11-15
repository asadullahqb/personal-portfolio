"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal] as const;
}

function ScribeClient() {
  const [config, setConfig] = useLocalStorage<{ apiBase: string; lang: string }>(
    "scribe_config",
    { apiBase: "http://localhost:8787", lang: "en-US" }
  );
  const [transcript, setTranscript] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Ready");
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState("");
  const recogRef = useRef<Recognition | null>(null);
  const recordingRef = useRef(false);
  const wakeLockRef = useRef<{ release?: () => Promise<void> } | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setTimeout(() => setStatus("ASR unavailable"), 0); return; }
    const r = new SR();
    r.lang = config.lang || "en-US";
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.continuous = true;
    r.onstart = () => { setStatus("Recording"); setRecording(true); };
    r.onerror = () => {
      setStatus("ASR error");
      if (recordingRef.current) {
        try { r.stop(); } catch {}
        setTimeout(() => { try { r.start(); } catch {} }, 300);
      }
    };
    r.onend = () => {
      if (recordingRef.current) {
        setStatus("Resuming");
        setTimeout(() => {
          try { r.start(); } catch {}
        }, 300);
      } else {
        setStatus("Stopped");
      }
    };
    r.onaudiostart = () => setStatus("Mic active");
    r.onsoundstart = () => setStatus("Listening");
    r.onresult = (e: unknown) => {
      const ev = e as { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] };
      let finalChunk = "";
      let interimChunk = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const text = ev.results[i][0].transcript + " ";
        if ((ev.results[i] as { isFinal: boolean }).isFinal) finalChunk += text; else interimChunk += text;
      }
      if (finalChunk) setTranscript((prev) => (prev + " " + finalChunk).trim());
      setInterim(interimChunk.trim());
    };
    recogRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, [config.lang]);

  useEffect(() => { recordingRef.current = recording; }, [recording]);

  async function startRecording() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch {}
    const n = navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<{ release?: () => Promise<void> }> } };
    try {
      if (n.wakeLock && !wakeLockRef.current) {
        try { wakeLockRef.current = await n.wakeLock.request('screen'); } catch {}
      }
    } catch {}
    setRecording(true);
    setInterim("");
    try { recogRef.current?.start(); } catch { setStatus("ASR start failed"); }
  }
  async function stopRecording() {
    setRecording(false);
    try { recogRef.current?.stop(); } catch {}
    try { await wakeLockRef.current?.release?.(); } catch {}
    wakeLockRef.current = null;
    setInterim("");
  }

  function resetAll() {
    setTranscript("");
    setNote("");
    setStatus("Ready");
    setRecording(false);
    setInterim("");
    try { recogRef.current?.stop(); } catch {}
  }

  async function summarize() {
    setStatus("Summarizing");
    const payload = { transcript };
    const res = await fetch(config.apiBase + "/summarize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { setStatus("Summarize failed"); return; }
    const json = await res.json();
    const n = json.note;
    setNote(typeof n === "string" ? n : JSON.stringify(n, null, 2));
    setStatus("Summarized");
  }

  function setLang(newLang: string) { setConfig({ apiBase: config.apiBase, lang: newLang || config.lang }); }

  return (
    <section
      id="tools"
      className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 12px)" }}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        <Card className="mt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500">{status}</div>
            <div className="flex gap-2 items-center">
              <label className="text-sm text-zinc-500">Language</label>
              <select
                value={config.lang}
                onChange={(e) => setLang(e.target.value)}
                className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200"
                aria-label="Recognition language"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="fr-FR">French</option>
                <option value="es-ES">Spanish</option>
                <option value="de-DE">German</option>
                <option value="ur-PK">Urdu (Pakistan)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <Button
              variant="primary"
              onClick={() => (recording ? stopRecording() : startRecording())}
              ariaLabel={recording ? "Stop Recording" : "Start Recording"}
              className={`p-0 w-10 h-10 rounded-full flex items-center justify-center ${recording ? "rotate-180" : "rotate-0"}`}
            >
              {recording ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                </svg>
              )}
            </Button>
            <Button variant="primary" onClick={summarize} ariaLabel="Summarize">Summarize</Button>
            <Button onClick={resetAll} ariaLabel="Reset" className="px-3 py-2">Reset</Button>
          </div>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <textarea value={(transcript + (interim ? " " + interim : "")).trim()} onChange={(e) => setTranscript(e.target.value)} rows={8} className="mt-3 w-full bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-xl p-3" placeholder="Live transcript" />
        </Card>
        
        <Card className="mt-6">
          <h3 className="text-lg font-semibold">Note</h3>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={12} className="mt-3 w-full bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-xl p-3" placeholder="Summarized clinical note" />
        </Card>

        
      </div>
    </section>
  );
}

export default function ScribePage() { return <ScribeClient />; }
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  maxAlternatives?: number;
  onstart?: () => void;
  onerror?: () => void;
  onend?: () => void;
  onaudiostart?: () => void;
  onsoundstart?: () => void;
  onresult?: (e: unknown) => void;
};
