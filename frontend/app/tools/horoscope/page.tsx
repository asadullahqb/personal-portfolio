"use client";

import { useState } from "react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

type Preferences = { tone?: "soft" | "neutral" | "direct"; focus?: "work" | "love" | "self-care" };
type Inputs = { [k: string]: any };

export default function HoroscopeTool() {
  const [philosophy, setPhilosophy] = useState("western");
  const [mode, setMode] = useState("basic");
  const [inputs, setInputs] = useState<Inputs>({ sign: "Aries" });
  const [preferences, setPreferences] = useState<Preferences>({ tone: "neutral", focus: "self-care" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const submit = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const body = {
        philosophy,
        mode,
        inputs,
        preferences,
        consent: { store_history: false, store_birth_details: false },
      };
      const r = await fetch(`${backend}/api/horoscope/daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`Request failed: ${r.status}`);
      const data = await r.json();
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Failed to generate horoscope");
    } finally {
      setLoading(false);
    }
  };


  const onPhilosophy = (v: string) => {
    setPhilosophy(v);
    setMode("basic");
    if (v === "western" || v === "vedic") setInputs({ sign: "Aries" });
    else if (v === "chinese") setInputs({ birth_year: 1996 });
  };

  const renderInputs = () => {
    if (mode === "basic") {
      if (philosophy === "western" || philosophy === "vedic") {
        const SIGNS = [
          "Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
        ];
        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm">Sign</label>
            <select className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" value={inputs.sign || "Aries"} onChange={(e) => setInputs({ ...inputs, sign: e.target.value })}>
              {SIGNS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        );
      }
      if (philosophy === "chinese") {
        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm">Birth Year</label>
            <input className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" type="number" value={inputs.birth_year || ""} onChange={(e) => setInputs({ ...inputs, birth_year: Number(e.target.value) })} />
          </div>
        );
      }
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm">Birth Date (YYYY-MM-DD)</label>
          <input className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" placeholder="1996-04-12" value={inputs.birth_date || ""} onChange={(e) => setInputs({ ...inputs, birth_date: e.target.value })} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm">Birth Time (HH:MM)</label>
          <input className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" placeholder="08:30" value={inputs.birth_time || ""} onChange={(e) => setInputs({ ...inputs, birth_time: e.target.value })} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm">Location</label>
          <input className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" placeholder="City, Country" value={inputs.location || ""} onChange={(e) => setInputs({ ...inputs, location: e.target.value })} />
        </div>
      </div>
    );
  };

  return (
    <section id="tools" className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start" style={{ paddingTop: "calc(var(--navbar-height) + 36px)", ["--navbar-height"]: "108px" } as React.CSSProperties}>
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          <Card>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Philosophy</label>
                  <select className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" value={philosophy} onChange={(e) => onPhilosophy(e.target.value)}>
                    <option value="western">Western</option>
                    <option value="chinese">Chinese</option>
                    <option value="vedic">Vedic</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Mode</label>
                  <select className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Tone</label>
                  <select className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" value={preferences.tone} onChange={(e) => setPreferences({ ...preferences, tone: e.target.value as Preferences["tone"] })}>
                    <option value="soft">Soft</option>
                    <option value="neutral">Neutral</option>
                    <option value="direct">Direct</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Focus</label>
                  <select className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" value={preferences.focus} onChange={(e) => setPreferences({ ...preferences, focus: e.target.value as Preferences["focus"] })}>
                    <option value="work">Work</option>
                    <option value="love">Love</option>
                    <option value="self-care">Self-care</option>
                  </select>
                </div>
              </div>
              {renderInputs()}
              
              <div className="text-xs text-zinc-500">We do not store birth data.</div>
              <div>
                <Button onClick={submit} ariaLabel="Generate horoscope" variant="primary">{loading ? "Generating..." : "Generate"}</Button>
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>
          </Card>
          <Card>
            {!result ? (
              <div className="text-zinc-500 text-sm">Your horoscope will appear here.</div>
            ) : (
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">Today</h3>
                <p className="text-sm text-zinc-800">{result.text}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Mood: <span className="font-medium">{result.mood}</span></div>
                  <div>Energy: <span className="font-medium">{result.energy}</span></div>
                  <div>Focus: <span className="font-medium">{result.focus}</span></div>
                  <div>Lucky Color: <span className="font-medium">{result.lucky_color}</span></div>
                  <div>Lucky Number: <span className="font-medium">{result.lucky_number}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Do: <span className="font-medium">{result.do}</span></div>
                  <div>Don’t: <span className="font-medium">{result.dont}</span></div>
                </div>
                <details className="text-xs text-zinc-500">
                  <summary>How this was generated</summary>
                  <div>{result.method_note}</div>
                </details>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}