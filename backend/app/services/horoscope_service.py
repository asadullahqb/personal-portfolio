import os
import json
import hashlib
import threading
from datetime import datetime
from typing import Any, Dict, Optional
import requests

_cache: Dict[str, Dict[str, Any]] = {}
_lock = threading.Lock()

def _hf_key() -> Optional[str]:
    return os.environ.get("HF_API_KEY")

def _hf_model() -> str:
    return os.environ.get("HF_MODEL", "moonshotai/Kimi-K2-Instruct:novita")

def _hf_chat(messages: Any) -> Optional[str]:
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

def _today_key() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")

def _hash_inputs(d: Dict[str, Any]) -> str:
    s = json.dumps(d, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def _prompt(philosophy: str, mode: str, inputs: Dict[str, Any], preferences: Dict[str, Any]) -> Any:
    tone = preferences.get("tone", "neutral")
    focus = preferences.get("focus", "self-care")
    sys = (
        "You generate respectful, supportive daily horoscopes. "
        "Always return a single JSON object with keys: "
        "text,mood,energy,focus,lucky_color,lucky_number,do,dont,method_note. "
        "Values: energy is 1-5 integer; mood is a short word; focus is one of work,love,self-care. "
        "Use a friendly, non-judgmental tone and avoid harsh language."
    )
    user = (
        f"philosophy={philosophy}\n"
        f"mode={mode}\n"
        f"tone={tone}\n"
        f"focus={focus}\n"
        f"inputs={json.dumps(inputs, ensure_ascii=False)}\n"
        "Return only JSON with the required keys, no markdown, no extra text."
    )
    return [{"role": "system", "content": sys}, {"role": "user", "content": user}]

def _fallback(philosophy: str, mode: str, inputs: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    sign = inputs.get("sign") or inputs.get("birth_year", "")
    txt = "Today favors steady progress. Keep expectations realistic and choose one clear priority."
    return {
        "text": txt,
        "mood": "calm",
        "energy": 3,
        "focus": preferences.get("focus", "self-care"),
        "lucky_color": "blue",
        "lucky_number": 7,
        "do": "Plan one task and complete it",
        "dont": "Overcommit or rush",
        "method_note": f"Generated via {philosophy} {mode}. No data stored.",
        "philosophy": philosophy,
        "mode": mode,
        "inputs_used": {k: inputs.get(k) for k in ("sign", "birth_year", "birth_date", "birth_time", "location") if k in inputs},
    }

def _shape(data: Any, philosophy: str, mode: str, inputs: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    try:
        obj = json.loads(data) if isinstance(data, str) else {}
    except Exception:
        obj = {}
    required = ["text", "mood", "energy", "focus", "lucky_color", "lucky_number", "do", "dont", "method_note"]
    if not all(k in obj for k in required):
        return _fallback(philosophy, mode, inputs, preferences)
    obj["philosophy"] = philosophy
    obj["mode"] = mode
    obj["inputs_used"] = {k: inputs.get(k) for k in ("sign", "birth_year", "birth_date", "birth_time", "location") if k in inputs}
    return obj

def generate_daily(philosophy: str, mode: str, inputs: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    day = _today_key()
    key_data = {"philosophy": philosophy, "mode": mode, "inputs": inputs, "preferences": preferences, "day": day}
    hashed = _hash_inputs(key_data)
    with _lock:
        if hashed in _cache:
            return _cache[hashed]
    msgs = _prompt(philosophy, mode, inputs, preferences)
    content = _hf_chat(msgs)
    shaped = _shape(content, philosophy, mode, inputs, preferences)
    with _lock:
        _cache[hashed] = shaped
    return shaped