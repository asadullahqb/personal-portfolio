const cfgKey = "scribe_config";
const storage = {
  get: (k, d) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const isLocal = typeof window !== "undefined" ? /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(window.location.hostname) : true;
const defaultBase = isLocal ? "http://localhost:8000" : "https://personal-portfolio-backend-nm7v.onrender.com";
let config = storage.get(cfgKey, { apiBase: defaultBase, lang: "en-US" });
try {
  const a = (config.apiBase || "").trim();
  if (!isLocal && a.includes("localhost")) {
    config.apiBase = defaultBase;
    storage.set(cfgKey, config);
  } else if (isLocal && a.includes("localhost:8787")) {
    config.apiBase = "http://localhost:8000";
    storage.set(cfgKey, config);
  }
} catch {}

function resolveApiBase() {
  const isLocalHost = typeof window !== "undefined" ? /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(window.location.hostname) : true;
  if (isLocalHost) return (config.apiBase || defaultBase);
  const a = (config.apiBase || "").trim();
  if (a.includes("localhost")) return defaultBase;
  return a || defaultBase;
}

const els = {
  status: document.getElementById("status"),
  startBtn: document.getElementById("startBtn"),
  stopBtn: document.getElementById("stopBtn"),
  audioFileInput: document.getElementById("audioFileInput"),
  uploadBtn: document.getElementById("uploadBtn"),
  attributeBtn: document.getElementById("attributeBtn"),
  summarizeBtn: document.getElementById("summarizeBtn"),
  transcript: document.getElementById("transcript"),
  dialogue: document.getElementById("dialogue"),
  note: document.getElementById("note"),
  copyNoteBtn: document.getElementById("copyNoteBtn"),
  downloadNoteBtn: document.getElementById("downloadNoteBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsDialog: document.getElementById("settingsDialog"),
  apiBaseInput: document.getElementById("apiBaseInput"),
  langInput: document.getElementById("langInput"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
};

let recognition;
let recording = false;
let currentFileId = null;
let finalTranscript = "";
function dedupeImmediate(s) {
  const parts = s.split(/\s+/);
  const out = [];
  let prev = "";
  for (const p of parts) {
    const n = p.replace(/[.,!?;:]+$/g, "").toLowerCase();
    if (n && n === prev) {
      continue;
    }
    out.push(p);
    prev = n;
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}
function norm(w){return w.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu,"").toLowerCase();}
function mergeAppend(base, addition){
  const a=(base||"").trim();
  const b=(addition||"").trim();
  if(!b) return a;
  if(!a) return dedupeImmediate(b);
  const aWords=a.split(/\s+/);
  const bWords=b.split(/\s+/);
  const aN=aWords.map(norm);
  const bN=bWords.map(norm);
  const maxK=Math.min(aWords.length,bWords.length,20);
  let overlap=0;
  for(let k=maxK;k>=1;k--){
    let ok=true;
    for(let i=0;i<k;i++){ if(aN[aN.length-k+i]!==bN[i]){ ok=false; break; } }
    if(ok){ overlap=k; break; }
  }
  const merged=(a+" "+bWords.slice(overlap).join(" ")).replace(/\s+/g," ").trim();
  return dedupeImmediate(merged);
}

function setStatus(t) { els.status.textContent = t; }

function initASR() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { setStatus("ASR unavailable"); return; }
  recognition = new SR();
  recognition.lang = config.lang || "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;
  recognition.onstart = () => setStatus("Recording");
  recognition.onerror = () => setStatus("ASR error");
  recognition.onend = () => { recording = false; setStatus("Stopped"); };
  recognition.onresult = (e) => {
    let f = "";
    let it = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript + " ";
      if (e.results[i].isFinal) f += t; else it += t;
    }
    if (f) {
      finalTranscript = mergeAppend(finalTranscript, f);
    }
    const display = mergeAppend(finalTranscript, it);
    els.transcript.value = display;
  };
}

function startRecording() {
  if (!recognition) return;
  if (recording) return;
  recording = true;
  finalTranscript = "";
  els.transcript.value = "";
  recognition.start();
}

function stopRecording() {
  if (!recognition) return;
  recognition.stop();
}

async function uploadAudioFile() {
  const file = els.audioFileInput.files && els.audioFileInput.files[0];
  if (!file) { setStatus("No file selected"); return; }
  setStatus("Upload init");
  const initRes = await fetch(config.apiBase + "/upload_init", { method: "POST" });
  if (!initRes.ok) { setStatus("Init failed"); return; }
  const initJson = await initRes.json();
  const uploadId = initJson.uploadId;
  const chunkSize = 1024 * 1024;
  const total = Math.ceil(file.size / chunkSize);
  for (let i = 0; i < total; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);
    setStatus("Uploading chunk " + (i + 1) + "/" + total);
    const u = new URL(config.apiBase + "/upload_chunk");
    u.searchParams.set("uploadId", uploadId);
    u.searchParams.set("index", String(i));
    const cRes = await fetch(u.toString(), { method: "POST", body: chunk });
    if (!cRes.ok) { setStatus("Chunk failed"); return; }
  }
  setStatus("Finalizing");
  const finRes = await fetch(config.apiBase + "/upload_finalize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uploadId }) });
  if (!finRes.ok) { setStatus("Finalize failed"); return; }
  const finJson = await finRes.json();
  currentFileId = finJson.fileId || null;
  setStatus("Upload complete");
}

async function attributeSpeakers() {
  if (!currentFileId) { setStatus("No file uploaded"); return; }
  setStatus("Attributing");
  const res = await fetch(resolveApiBase() + "/attribute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: currentFileId }) });
  if (!res.ok) { setStatus("Attribute failed"); return; }
  const json = await res.json();
  const d = json.dialogue;
  els.dialogue.value = typeof d === "string" ? d : JSON.stringify(d, null, 2);
  setStatus("Attributed");
}

async function summarize() {
  setStatus("Summarizing");
  const payload = { transcript: els.transcript.value, dialogue: els.dialogue.value };
  try {
    const res = await fetch(resolveApiBase() + "/summarize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { setStatus("Summarize failed"); return; }
    const json = await res.json();
    const n = json.note;
    els.note.value = typeof n === "string" ? n : JSON.stringify(n, null, 2);
    setStatus("Summarized");
  } catch (e) {
    setStatus("Summarize failed");
  }
}

function copyNote() {
  const v = els.note.value || "";
  navigator.clipboard.writeText(v).then(() => setStatus("Copied"));
}

function downloadNote() {
  const v = els.note.value || "";
  const blob = new Blob([v], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "note.md"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function openSettings() {
  els.apiBaseInput.value = config.apiBase || "";
  els.langInput.value = config.lang || "en-US";
  if (typeof els.settingsDialog.showModal === "function") els.settingsDialog.showModal();
}

function closeSettings() { els.settingsDialog.close(); }

function saveSettings() {
  config = { apiBase: els.apiBaseInput.value.trim() || config.apiBase, lang: els.langInput.value.trim() || config.lang };
  storage.set(cfgKey, config);
  if (recognition) recognition.lang = config.lang;
  closeSettings();
}

els.startBtn.addEventListener("click", startRecording);
els.stopBtn.addEventListener("click", stopRecording);
els.uploadBtn.addEventListener("click", uploadAudioFile);
els.attributeBtn.addEventListener("click", attributeSpeakers);
els.summarizeBtn.addEventListener("click", summarize);
els.copyNoteBtn.addEventListener("click", copyNote);
els.downloadNoteBtn.addEventListener("click", downloadNote);
els.settingsBtn.addEventListener("click", openSettings);
els.closeSettingsBtn.addEventListener("click", closeSettings);
els.saveSettingsBtn.addEventListener("click", saveSettings);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

initASR();
