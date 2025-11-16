from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(prefix="/welcome", tags=["Welcome Translator"])

class WelcomeInput(BaseModel):
    ip: str | None = None

class WelcomeOutput(BaseModel):
    message: str
    language: str
    country_code: str
    ip_used: str
    source: str

@router.post("/", response_model=WelcomeOutput)
def welcome(payload: WelcomeInput, request: Request):
    al = request.headers.get("accept-language") or ""
    country = request.headers.get("x-vercel-ip-country") or request.headers.get("cf-ipcountry") or "US"
    ip_hdr = request.headers.get("x-forwarded-for")
    client_ip = ip_hdr.split(",")[0].strip() if ip_hdr else (request.client.host if request.client else "")
    ip = payload.ip or client_ip or ""
    supported = ["en", "es", "fr", "de", "pt", "ur", "ar", "zh", "ja"]
    def pick_lang(src: str) -> str:
        try:
            parts = [p.strip() for p in src.split(",") if p.strip()]
            prefs = []
            for p in parts:
                if ";q=" in p:
                    lang, q = p.split(";q=", 1)
                    prefs.append((lang.strip().lower(), float(q)))
                else:
                    prefs.append((p.strip().lower(), 1.0))
            prefs.sort(key=lambda x: x[1], reverse=True)
            for lang, _ in prefs:
                base = lang.split("-")[0]
                for candidate in [lang, base]:
                    if candidate in supported:
                        return candidate
        except:
            pass
        return "en"
    lang = pick_lang(al)
    messages = {
        "en": "Welcome.",
        "es": "Bienvenido.",
        "fr": "Bienvenue.",
        "de": "Willkommen.",
        "pt": "Bem-vindo.",
        "ur": "خوش آمدید۔",
        "ar": "مرحبًا.",
        "zh": "欢迎。",
        "ja": "ようこそ。",
    }
    msg = messages.get(lang, "Welcome.")
    return {"message": msg, "language": lang, "country_code": country, "ip_used": ip, "source": "header"}
