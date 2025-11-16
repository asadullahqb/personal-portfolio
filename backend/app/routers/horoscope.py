from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from app.services.horoscope_service import generate_daily
from app.services.email_service import send_email
from app.utils.storage import add_subscriber, remove_subscriber, list_subscribers
from datetime import datetime

router = APIRouter(prefix="/api/horoscope", tags=["Horoscope"])

class Preferences(BaseModel):
    tone: Optional[str] = Field(default="neutral")
    focus: Optional[str] = Field(default="self-care")

class Consent(BaseModel):
    store_history: bool = False
    store_birth_details: bool = False

class HoroscopeRequest(BaseModel):
    philosophy: str
    mode: str
    inputs: Dict[str, Any]
    preferences: Optional[Preferences] = None
    consent: Optional[Consent] = None

class HoroscopeResponse(BaseModel):
    text: str
    mood: str
    energy: int
    focus: str
    lucky_color: str
    lucky_number: int
    do: str
    dont: str
    method_note: str
    philosophy: str
    mode: str
    inputs_used: Dict[str, Any]

class EmailRequest(BaseModel):
    email: str
    philosophy: str
    mode: str
    inputs: Dict[str, Any]
    preferences: Optional[Preferences] = None

class EmailResponse(BaseModel):
    ok: bool

class SubscribeRequest(BaseModel):
    email: str
    philosophy: str
    mode: str
    inputs: Dict[str, Any]
    preferences: Optional[Preferences] = None

class SubscribeResponse(BaseModel):
    ok: bool

class UnsubscribeRequest(BaseModel):
    email: str

class SendDailyResponse(BaseModel):
    sent: int
    failed: int

def _validate(req: HoroscopeRequest) -> None:
    p = req.philosophy.lower()
    m = req.mode.lower()
    if p not in {"western", "chinese", "vedic"}:
        raise HTTPException(status_code=400, detail="Unsupported philosophy")
    if m not in {"basic", "advanced"}:
        raise HTTPException(status_code=400, detail="Unsupported mode")
    inp = req.inputs or {}
    if p == "western" and m == "basic" and "sign" not in inp:
        raise HTTPException(status_code=400, detail="sign is required for western basic")
    if p == "chinese" and m == "basic" and "birth_year" not in inp:
        raise HTTPException(status_code=400, detail="birth_year is required for chinese basic")
    if m == "advanced" and not all(k in inp for k in ["birth_date", "birth_time"]):
        raise HTTPException(status_code=400, detail="birth_date and birth_time are required for advanced mode")

@router.post("/daily", response_model=HoroscopeResponse)
def daily(req: HoroscopeRequest) -> HoroscopeResponse:
    _validate(req)
    prefs = (req.preferences.dict() if req.preferences else {})
    result = generate_daily(req.philosophy.lower(), req.mode.lower(), req.inputs, prefs)
    return HoroscopeResponse(**result)

@router.post("/email", response_model=EmailResponse)
def email_update(req: EmailRequest) -> EmailResponse:
    # Validate using same rules
    tmp = HoroscopeRequest(
        philosophy=req.philosophy,
        mode=req.mode,
        inputs=req.inputs,
        preferences=req.preferences,
        consent=None,
    )
    _validate(tmp)
    prefs = (req.preferences.dict() if req.preferences else {})
    result = generate_daily(req.philosophy.lower(), req.mode.lower(), req.inputs, prefs)
    text = result.get("text", "")
    mood = result.get("mood", "")
    energy = result.get("energy", 3)
    focus = result.get("focus", "self-care")
    body = (
        f"Your Daily Horoscope\n\n"
        f"Philosophy: {result.get('philosophy')}\n"
        f"Mode: {result.get('mode')}\n"
        f"Mood: {mood}\nEnergy: {energy}\nFocus: {focus}\n\n"
        f"{text}\n\n"
        f"Do: {result.get('do')}\nDon't: {result.get('dont')}\n\n"
        f"Lucky Color: {result.get('lucky_color')}\nLucky Number: {result.get('lucky_number')}\n"
    )
    ok = send_email(req.email, "Your Daily Horoscope", body)
    return EmailResponse(ok=ok)

@router.post("/subscribe", response_model=SubscribeResponse)
def subscribe(req: SubscribeRequest) -> SubscribeResponse:
    tmp = HoroscopeRequest(
        philosophy=req.philosophy,
        mode=req.mode,
        inputs=req.inputs,
        preferences=req.preferences,
        consent=None,
    )
    _validate(tmp)
    item = {
        "email": req.email,
        "philosophy": req.philosophy.lower(),
        "mode": req.mode.lower(),
        "inputs": req.inputs,
        "preferences": (req.preferences.dict() if req.preferences else {}),
        "created_at": datetime.utcnow().isoformat(),
    }
    ok = add_subscriber(item)
    return SubscribeResponse(ok=ok)

@router.post("/unsubscribe", response_model=SubscribeResponse)
def unsubscribe(req: UnsubscribeRequest) -> SubscribeResponse:
    ok = remove_subscriber(req.email)
    return SubscribeResponse(ok=ok)

@router.post("/send-daily", response_model=SendDailyResponse)
def send_daily() -> SendDailyResponse:
    subs = list_subscribers()
    sent = 0
    failed = 0
    for s in subs:
        try:
            prefs = s.get("preferences", {})
            out = generate_daily(s.get("philosophy"), s.get("mode"), s.get("inputs"), prefs)
            text = out.get("text", "")
            mood = out.get("mood", "")
            energy = out.get("energy", 3)
            focus = out.get("focus", "self-care")
            body = (
                f"Your Daily Horoscope\n\n"
                f"Philosophy: {out.get('philosophy')}\n"
                f"Mode: {out.get('mode')}\n"
                f"Mood: {mood}\nEnergy: {energy}\nFocus: {focus}\n\n"
                f"{text}\n\n"
                f"Do: {out.get('do')}\nDon't: {out.get('dont')}\n\n"
                f"Lucky Color: {out.get('lucky_color')}\nLucky Number: {out.get('lucky_number')}\n"
            )
            if send_email(s.get("email"), "Your Daily Horoscope", body):
                sent += 1
            else:
                failed += 1
        except Exception:
            failed += 1
    return SendDailyResponse(sent=sent, failed=failed)