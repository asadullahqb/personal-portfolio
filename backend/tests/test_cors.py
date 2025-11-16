from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app


client = TestClient(app)


def test_cors_preflight_welcome_www():
    origin = "https://www.asadullahqamarbhatti.com"
    r = client.options(
        "/welcome/",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert r.status_code == 200
    assert r.headers.get("access-control-allow-origin") == origin


def test_cors_post_welcome_apex():
    origin = "https://asadullahqamarbhatti.com"
    r = client.post(
        "/welcome/",
        headers={
            "Origin": origin,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={"ip": "8.8.8.8"},
    )
    assert r.status_code == 200
    assert r.headers.get("access-control-allow-origin") == origin
