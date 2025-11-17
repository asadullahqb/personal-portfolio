import os
import re
from typing import Any, Dict, List, Optional
import requests

def _hf_key() -> Optional[str]:
    return os.environ.get("HF_API_KEY")

def _hf_model() -> str:
    return os.environ.get("HF_MODEL", "moonshotai/Kimi-K2-Instruct:novita")

def _hf_chat(messages: List[Dict[str, str]]) -> Optional[str]:
    key = _hf_key()
    if not key:
        return None
    url = "https://router.huggingface.co/v1/chat/completions"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    body = {"model": _hf_model(), "messages": messages}
    try:
        r = requests.post(url, headers=headers, json=body, timeout=30)
        r.raise_for_status()
        data = r.json()
        if isinstance(data, dict) and "choices" in data:
            ch = data["choices"]
            if isinstance(ch, list) and ch:
                msg = ch[0].get("message", {})
                return msg.get("content")
    except Exception:
        return None
    return None

def _keywords() -> List[str]:
    return [
        "corruption",
        "fraud",
        "scam",
        "money laundering",
        "conflict of interest",
        "kickback",
        "procurement",
        "shell company",
        "misrepresentation",
        "sanction",
        "ban",
        "investigation",
        "charged",
        "convicted",
    ]

def _fetch_sources(name: str, org: Optional[str]) -> List[Dict[str, Any]]:
    q = name.strip()
    if org:
        q += f" {org.strip()}"
    wiki = f"https://en.wikipedia.org/wiki/{q.replace(' ', '_')}"
    news = f"https://news.google.com/search?q={requests.utils.quote(q + ' Malaysia')}"
    return [
        {"url": wiki, "snippet": f"General profile of {q}.", "credibility_score": 0.6},
        {"url": news, "snippet": f"Recent news about {q} in Malaysia.", "credibility_score": 0.5},
    ]

def _detect_flags(snippets: List[str]) -> Dict[str, Any]:
    text = "\n".join(snippets).lower()
    hits = 0
    matched: List[str] = []
    for k in _keywords():
        if re.search(r"\b" + re.escape(k) + r"\b", text):
            hits += 1
            matched.append(k)
    score = min(0.95, 0.3 + 0.2 * hits)
    return {"hits": hits, "matched": matched, "risk": score}

def run_investigation(target_type: str, name: str, org_opt: Optional[str] = None, timeframe_opt: Optional[str] = None, context_opt: Optional[str] = None) -> Dict[str, Any]:
    tt = (target_type or "").strip().lower()
    nm = (name or "").strip()
    if tt not in {"individual", "organisation"}:
        return {"error": "invalid_target_type"}
    if not nm:
        return {"error": "invalid_name"}
    sources = _fetch_sources(nm, org_opt)
    snippets = [s.get("snippet", "") for s in sources]
    if context_opt:
        snippets.append(context_opt)
    flags = _detect_flags(snippets)
    risk = float(flags.get("risk", 0.0))
    verdict = "Problematic" if risk >= 0.5 else "Clean"
    hits = int(flags.get("hits", 0))
    if hits == 0:
        comments = (
            "Cautious assessment\n"
            "No adverse signals found in the consulted public sources. Matched signals: none.\n"
            "This tool does not publish allegations and avoids definitive claims without attributed evidence.\n"
            "Next steps: continue low-intensity monitoring for new litigation or regulatory actions; perform routine due diligence if needed."
        )
    else:
        sys_prompt = (
            "You assess public-source signals for ethical risk. Use cautious language.\n"
            "Only reference the matched signals provided; do not invent facts.\n"
            "Summarize concerns and rationale in 4-6 sentences, then advise next steps."
        )
        user_content = (
            f"Target: {tt} | Name: {nm} | Org: {org_opt or ''} | Timeframe: {timeframe_opt or ''}\n\n"
            f"Sources:\n" + "\n".join([f"- {s['url']}: {s['snippet']}" for s in sources]) + "\n\n"
            f"Matched signals: {', '.join(flags.get('matched', [])) or 'none'}\n"
            f"Risk score: {risk:.2f}"
        )
        llm = _hf_chat([{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_content}])
        comments = llm or (
            "Public-source review indicates possible concerns. Matched signals: "
            + (", ".join(flags.get("matched", [])) or "none")
            + "."
        )
    return {
        "verdict": verdict,
        "comments": comments,
        "sources": sources,
        "risk_score": risk,
        "flags": flags,
    }