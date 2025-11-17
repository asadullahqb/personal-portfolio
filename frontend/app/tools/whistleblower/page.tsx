"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";

function useApiBase() {
  const [apiBase, setApiBase] = useState("");
  useEffect(() => {
    const hostOk = typeof window !== "undefined" && window.location && !/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(window.location.hostname);
    if (hostOk) setApiBase(process.env.BACKEND_URL || "https://personal-portfolio-backend-nm7v.onrender.com");
    else setApiBase("http://localhost:8000");
  }, []);
  return apiBase;
}

export default function WhistleblowerPage() {
  const enabled = typeof process !== "undefined" && (process.env.NEXT_PUBLIC_ENABLE_WHISTLEBLOWER === "true");
  const router = useRouter();
  useEffect(() => {
    if (!enabled) {
      router.replace("/tools/coming-soon");
    }
  }, [enabled, router]);
  if (!enabled) return null;
  const apiBase = useApiBase();
  const [targetType, setTargetType] = useState("individual");
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState("Ready");
  const [result, setResult] = useState<{ verdict: string; comments: string; sources: { url: string; snippet: string; credibility_score: number }[]; risk_score: number } | null>(null);

  async function analyze() {
    setStatus("Analyzing");
    setResult(null);
    const payload = { target_type: targetType, name, organisation: organisation || undefined, timeframe: timeframe || undefined, context: context || undefined };
    try {
      const res = await fetch(apiBase + "/api/whistleblower/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { setStatus("Failed"); return; }
      const json = await res.json();
      setResult(json);
      setStatus("Done");
    } catch {
      setStatus("Failed");
    }
  }

  return (
    <section id="whistleblower" className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start" style={{ paddingTop: "calc(var(--navbar-height) + 36px)", ["--navbar-height"]: "108px" } as React.CSSProperties}>
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        <Card className="mt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500">{status}</div>
            {result ? (
              <Badge className={result.verdict === "Problematic" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>{result.verdict}</Badge>
            ) : null}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Target Type</label>
              <select value={targetType} onChange={(e) => setTargetType(e.target.value)} className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" aria-label="Target type">
                <option value="individual">Individual</option>
                <option value="organisation">Organisation</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" placeholder="Full name or entity name" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Organisation (optional)</label>
              <input value={organisation} onChange={(e) => setOrganisation(e.target.value)} className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" placeholder="Affiliated organisation" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Timeframe (optional)</label>
              <input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="px-3 py-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200" placeholder="e.g., 2018–2022" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-zinc-600">Context Notes (optional)</label>
            <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} className="mt-2 w-full bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-xl p-3" placeholder="Purpose or relevant context" />
          </div>
          <div className="mt-4 flex gap-2 items-center">
            <Button variant="primary" onClick={analyze} ariaLabel="Run investigation">Analyze</Button>
            <p className="text-xs text-zinc-500">Uses public sources only. Results are indicative.</p>
          </div>
        </Card>

        {result ? (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold">Assessment</h3>
            <p className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap">{result.comments}</p>
            <div className="mt-4">
              <h4 className="text-sm font-semibold">Sources</h4>
              <ul className="mt-2 space-y-2">
                {result.sources.map((s, i) => (
                  <li key={i} className="text-sm">
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{s.url}</a>
                    <span className="ml-2 text-zinc-600">{s.snippet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  );
}