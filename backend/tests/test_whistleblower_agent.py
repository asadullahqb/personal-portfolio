from app.services.whistleblower_service import run_investigation

def test_validation_errors():
    out = run_investigation("person", "")
    assert out.get("error") in {"invalid_target_type", "invalid_name"}

def test_verdict_mapping_problematic():
    out = run_investigation("individual", "John Doe", context_opt="alleged fraud investigation reported")
    assert out["verdict"] == "Problematic"
    assert out["risk_score"] >= 0.5

def test_source_attribution_present():
    out = run_investigation("organisation", "Acme Corp")
    sources = out.get("sources", [])
    assert isinstance(sources, list) and len(sources) >= 1
    assert all(s.get("url") for s in sources)