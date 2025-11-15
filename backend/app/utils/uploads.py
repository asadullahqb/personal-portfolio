import os
import tempfile
import secrets
import time
from pathlib import Path

def _root() -> Path:
    return Path(tempfile.gettempdir()) / "msa_uploads"

def _upload_dir(upload_id: str) -> Path:
    return _root() / f"upload_{upload_id}"

def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)

def init_upload() -> str:
    upload_id = secrets.token_hex(12)
    ensure_dir(_upload_dir(upload_id))
    return upload_id

def write_chunk(upload_id: str, index: int, data: bytes) -> None:
    d = _upload_dir(upload_id)
    ensure_dir(d)
    name = f"chunk_{str(index).zfill(6)}"
    (d / name).write_bytes(data)

def finalize_upload(upload_id: str, filename: str | None = None) -> str:
    d = _upload_dir(upload_id)
    ensure_dir(_root())
    parts = sorted([p for p in d.glob("chunk_*")])
    out_name = filename if filename else f"upload_{int(time.time()*1000)}.webm"
    out_path = _root() / out_name
    with out_path.open("wb") as w:
        for p in parts:
            w.write(p.read_bytes())
    for p in parts:
        try:
            p.unlink()
        except Exception:
            pass
    try:
        d.rmdir()
    except Exception:
        pass
    return str(out_path)