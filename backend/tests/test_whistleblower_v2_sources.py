from app.services.whistleblower_service import run_investigation

def test_sources_include_linkedin_and_social():
    out = run_investigation("individual", "Asadullah Qamar Bhatti")
    urls = [s.get("url", "") for s in out.get("sources", [])]
    assert any("linkedin.com" in u for u in urls)
    assert any("facebook.com" in u for u in urls)
    assert any("tiktok.com" in u for u in urls)