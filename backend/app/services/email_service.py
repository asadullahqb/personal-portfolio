import os
import smtplib
from email.message import EmailMessage
from typing import Optional

def _smtp_config():
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USERNAME")
    pwd = os.environ.get("SMTP_PASSWORD")
    sender = os.environ.get("SMTP_FROM_EMAIL")
    return host, port, user, pwd, sender

def send_email(to_email: str, subject: str, body_text: str) -> bool:
    host, port, user, pwd, sender = _smtp_config()
    if not host or not port or not user or not pwd or not sender:
        return False
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body_text)
    try:
        with smtplib.SMTP(host, port) as s:
            s.starttls()
            s.login(user, pwd)
            s.send_message(msg)
        return True
    except Exception:
        return False