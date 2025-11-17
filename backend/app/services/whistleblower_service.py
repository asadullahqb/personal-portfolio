import os
import re
from typing import Any, Dict, List, Optional
import asyncio
import httpx
import requests
import importlib

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

def _openai_key() -> Optional[str]:
    return os.environ.get("OPENAI_API_KEY")

def _openai_model() -> str:
    return os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

def _ag2_summary(system_prompt: str, user_content: str) -> Optional[str]:
    try:
        ag2 = importlib.import_module("autogen")
    except Exception:
        return None
    key = _openai_key()
    if not key:
        return None
    try:
        llm_config = ag2.LLMConfig(config_list={"api_type": "openai", "model": _openai_model(), "api_key": key})
        agent = ag2.ConversableAgent(name="wb_assessor", system_message=system_prompt, llm_config=llm_config)
        resp = agent.run(message=user_content, max_turns=1, user_input=False)
        try:
            resp.process()
        except Exception:
            pass
        msgs = getattr(resp, "messages", None)
        if isinstance(msgs, list) and msgs:
            for m in reversed(msgs):
                if isinstance(m, dict) and (m.get("role") in ("assistant", "ai", "bot")):
                    c = m.get("content") or m.get("text") or ""
                    if c:
                        return c.strip()
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
    li_people = "https://www.google.com/search?q=" + requests.utils.quote(f"site:linkedin.com/in \"{q}\" Malaysia")
    li_company = "https://www.google.com/search?q=" + requests.utils.quote(f"site:linkedin.com/company \"{q}\" Malaysia")
    fb_search = f"https://www.facebook.com/search/top/?q={requests.utils.quote(q)}"
    tiktok_search = f"https://www.tiktok.com/search?q={requests.utils.quote(q)}"
    return [
        {"url": wiki, "snippet": f"General profile of {q}.", "credibility_score": 0.6},
        {"url": news, "snippet": f"Recent news about {q} in Malaysia.", "credibility_score": 0.5},
        {"url": li_people, "snippet": f"LinkedIn people profiles matching {q} (Google site search).", "credibility_score": 0.4},
        {"url": li_company, "snippet": f"LinkedIn company pages matching {q} (Google site search).", "credibility_score": 0.4},
        {"url": fb_search, "snippet": f"Facebook public search results for {q}.", "credibility_score": 0.3},
        {"url": tiktok_search, "snippet": f"TikTok public search results for {q}.", "credibility_score": 0.25},
    ]

def _candidate_urls(q: str) -> List[str]:
    bases = [
        f"https://en.wikipedia.org/wiki/{q.replace(' ', '_')}",
        "https://www.thestar.com.my/search?q=" + requests.utils.quote(q),
        "https://www.nst.com.my/search?keywords=" + requests.utils.quote(q),
        "https://www.astroawani.com/search?q=" + requests.utils.quote(q),
        "https://www.freemalaysiatoday.com/?s=" + requests.utils.quote(q),
        "https://www.theedgemarkets.com/search-results?keywords=" + requests.utils.quote(q),
        "https://news.google.com/search?q=" + requests.utils.quote(q + " Malaysia"),
        "https://duckduckgo.com/html/?q=" + requests.utils.quote(q + " Malaysia"),
        "https://www.facebook.com/search/top/?q=" + requests.utils.quote(q),
        "https://www.tiktok.com/search?q=" + requests.utils.quote(q),
        "https://www.google.com/search?q=" + requests.utils.quote(f"site:linkedin.com/in \"{q}\" Malaysia"),
        "https://www.google.com/search?q=" + requests.utils.quote(f"site:linkedin.com/company \"{q}\" Malaysia"),
    ]
    extras = [
        "https://malaysiakini.com/search?q=" + requests.utils.quote(q),
        "https://www.bharian.com.my/search?query=" + requests.utils.quote(q),
        "https://www.sinarharian.com.my/search?query=" + requests.utils.quote(q),
        "https://www.utusan.com.my/?s=" + requests.utils.quote(q),
        "https://www.malaymail.com/search?keywords=" + requests.utils.quote(q),
        "https://www.freemalaysiatoday.com/?s=" + requests.utils.quote(q + " corruption"),
        "https://www.thestar.com.my/search?q=" + requests.utils.quote(q + " fraud"),
        "https://news.google.com/search?q=" + requests.utils.quote(q + " procurement"),
    ]
    out = bases + extras
    return out[:20]

def _extract_title(html: str) -> str:
    m = re.search(r"<title[^>]*>(.*?)</title>", html or "", re.IGNORECASE | re.DOTALL)
    if m:
        t = re.sub(r"\s+", " ", m.group(1)).strip()
        return t[:280]
    return ""

async def _parallel_fetch(q: str, limit: int) -> List[Dict[str, Any]]:
    urls = _candidate_urls(q)[:limit]
    async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
        async def pull(u: str) -> Dict[str, Any]:
            try:
                r = await client.get(u)
                title = _extract_title(r.text)
                cred = 0.3
                if "wikipedia.org" in u or "thestar.com.my" in u or "news.google.com" in u:
                    cred = 0.5
                if "facebook.com" in u or "tiktok.com" in u:
                    cred = 0.25
                return {"url": u, "snippet": title or "", "credibility_score": cred}
            except Exception:
                return {"url": u, "snippet": "", "credibility_score": 0.2}
        tasks = [pull(u) for u in urls]
        results = await asyncio.gather(*tasks)
    return [r for r in results if r.get("url")]

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

def run_investigation(target_type: str, name: str, org_opt: Optional[str] = None, timeframe_opt: Optional[str] = None, context_opt: Optional[str] = None, deep_search: bool = False, deep_limit: int = 20) -> Dict[str, Any]:
    tt = (target_type or "").strip().lower()
    nm = (name or "").strip()
    if tt not in {"individual", "organisation"}:
        return {"error": "invalid_target_type"}
    if not nm:
        return {"error": "invalid_name"}
    sources = _fetch_sources(nm, org_opt)
    if deep_search:
        try:
            extra = asyncio.run(_parallel_fetch(nm, deep_limit))
            sources = sources + extra
        except Exception:
            pass
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
        ag2_text = _ag2_summary(sys_prompt, user_content)
        comments = llm or ag2_text or (
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