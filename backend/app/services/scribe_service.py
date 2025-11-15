import os
import requests
from typing import Optional, List, Dict, Any

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

def attribute_dialogue(segments: Optional[List[Dict[str, Any]]] = None, audio_file_id: Optional[str] = None) -> Dict[str, Any]:
    content = "\n".join([str(s.get("text", "")) for s in (segments or [])]).strip()
    sys_prompt = (
        "You are a medical scribe. Convert the conversation into labeled dialogue with lines prefixed as [Clinician] or [Patient]. "
        "Preserve chronological order and keep text unchanged except for labels."
    )
    messages = [{"role": "system", "content": sys_prompt}, {"role": "user", "content": content or f"Audio file: {audio_file_id or ''}"}]
    llm = _hf_chat(messages)
    if llm:
        return {"dialogue": llm, "provider": "huggingface"}
    # Fallback minimal behavior
    if segments:
        lines = []
        sp = 0
        for s in segments:
            label = "Clinician" if sp % 2 == 0 else "Patient"
            t = str(s.get("text", "")).strip()
            if t:
                lines.append(f"[{label}] {t}")
            sp += 1
        return {"dialogue": "\n".join(lines), "provider": "fallback"}
    return {"dialogue": "", "provider": "fallback"}

def summarize_note(transcript: str, dialogue: Optional[str] = None, audio_file_id: Optional[str] = None) -> Dict[str, Any]:
    content = dialogue or transcript or ""
    sys_prompt = (
        "You are a clinical scribe. Generate a clear, concise SOAP note (Subjective, Objective, Assessment, Plan) from the provided dialogue/transcript. "
        "Return markdown with section headings."
    )
    messages = [{"role": "system", "content": sys_prompt}, {"role": "user", "content": content}]
    llm = _hf_chat(messages)
    if llm:
        return {"note": llm, "provider": "huggingface"}
    # Minimal fallback
    note = (
        "# Subjective\n- N/A\n\n# Objective\n- N/A\n\n# Assessment\n- N/A\n\n# Plan\n- N/A"
    )
    return {"note": note, "provider": "fallback"}