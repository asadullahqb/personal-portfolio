import json
import os
import threading
from typing import Any, Dict, List

_lock = threading.Lock()

def _path() -> str:
    base = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(base), "data")
    os.makedirs(data_dir, exist_ok=True)
    return os.path.join(data_dir, "subscribers.json")

def _read() -> List[Dict[str, Any]]:
    p = _path()
    if not os.path.exists(p):
        return []
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f) or []
    except Exception:
        return []

def _write(data: List[Dict[str, Any]]) -> None:
    p = _path()
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def add_subscriber(item: Dict[str, Any]) -> bool:
    with _lock:
        subs = _read()
        if any(s.get("email") == item.get("email") for s in subs):
            for s in subs:
                if s.get("email") == item.get("email"):
                    s.update(item)
            _write(subs)
            return True
        subs.append(item)
        _write(subs)
        return True

def remove_subscriber(email: str) -> bool:
    with _lock:
        subs = _read()
        new_subs = [s for s in subs if s.get("email") != email]
        _write(new_subs)
        return len(subs) != len(new_subs)

def list_subscribers() -> List[Dict[str, Any]]:
    with _lock:
        return _read()