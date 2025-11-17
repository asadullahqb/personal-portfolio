# Iteration: Implement

- Created backend endpoint `POST /api/whistleblower/analyze` with input validation and deterministic fallback pipeline.
- Added service orchestration: source fetch stub, keyword pattern detection, risk scoring, optional HF summarization via existing HF chat path.
- Integrated router in both `backend/app/main.py` and `backend/main.py`.
- Built frontend page `frontend/app/tools/whistleblower/page.tsx` with form, disclaimer, verdict badge, comments, and sources list; linked from tools index.

## Challenges

- No AG2 or dedicated OSINT tools present; implemented safe stub fetchers (Wikipedia and Google News) to avoid external dependencies.
- HF inference not guaranteed; reused existing `HF_API_KEY` chat path with graceful fallback to heuristic comments.
- Risk scoring calibration required adjustment; initial weights under-classified single strong signals.
- CORS/base URL resolution needed to align with existing tools; mirrored scribe’s dynamic base selection to avoid localhost in production.
- Safety constraints enforced: public-sources-only, minimal data handling, no storage; comments use cautious language.

## Decisions

- Threshold set at `risk_score >= 0.5` for `Problematic`; weights tuned to meet acceptance criteria while keeping conservatism.
- Response includes `verdict`, `comments`, `sources`, `risk_score`, and `flags` for transparency.
- Env additions documented in backend `.env.example`: `AG2_API_KEY`, `HF_INFERENCE_API_KEY`, `WHISTLEBLOWER_RATE_LIMIT`.

## Next Iteration Hook

- Ready for integrating real OSINT fetchers and reranking when keys are available; caching of safe summaries can be added behind a feature flag.