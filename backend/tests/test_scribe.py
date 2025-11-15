from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

client = TestClient(app)

def test_upload_flow_and_finalize():
    r = client.post("/upload_init")
    assert r.status_code == 200
    upload_id = r.json().get("uploadId")
    assert upload_id
    r2 = client.post(f"/upload_chunk?uploadId={upload_id}&index=0", data=b"hello")
    assert r2.status_code == 200
    r3 = client.post("/upload_finalize", json={"uploadId": upload_id})
    assert r3.status_code == 200
    file_id = r3.json().get("fileId")
    assert isinstance(file_id, str) and len(file_id) > 0

def test_attribute_segments():
    payload = {"segments": [{"ts": 0, "text": "Hello"}, {"ts": 1, "text": "Hi"}]}
    r = client.post("/attribute", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert "dialogue" in j and "provider" in j
    assert "Clinician" in j["dialogue"] and "Patient" in j["dialogue"]

def test_summarize_transcript():
    payload = {"transcript": "[Clinician] How can I help?\n[Patient] I have a cough."}
    r = client.post("/summarize", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert "note" in j and "provider" in j
    assert "Subjective" in j["note"] and "Plan" in j["note"]