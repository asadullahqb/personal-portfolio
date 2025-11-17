# Version 1 Design (Agentic Whistleblower)

**Objective**
- Provide a public-sources-only assessment with a `Clean` or `Problematic` verdict, transparent comments, and attributed sources.

**Scope Implemented**
- Frontend `tools/whistleblower` form and results UI with disclaimer, verdict badge, comments, and sources.
- Backend `POST /api/whistleblower/analyze` orchestrating source stubs, pattern detection, risk scoring, and cautious comments.
- No uploads, no storage; optional HF summarization when signals exist and keys are present.

**Architecture**
- Frontend: `frontend/app/tools/whistleblower/page.tsx` uses `Card`, `Button`, `Badge` and dynamic backend base resolution.
- Backend Router: `backend/app/routers/whistleblower.py` exposes analysis endpoint and response model.
- Backend Service: `backend/app/services/whistleblower_service.py` performs fetch → detect → score → comment.
- Inclusion: routers registered in `backend/app/main.py` and `backend/main.py`.

**Data Flow**
- Inputs: `target_type`, `name`, optional `organisation`, `timeframe`, `context`.
- Sources: Wikipedia and Google News query stubs with credibility hints.
- Detection: keyword flags for corruption/fraud patterns; counts and matched list.
- Scoring: `risk_score = min(0.95, 0.3 + 0.2 * hits)`, verdict `Problematic` if `>= 0.5`.
- Comments: deterministic non-allegation template when `hits == 0`; stricter LLM prompt otherwise.

**Safety & Compliance**
- Public-sources-only; no definitive claims without evidence; explicit disclaimers.
- Avoids publishing accusations; matched signals listed transparently.
- CORS configured; no PII logging; rate limit placeholders for future.

**UX Copy**
- Purpose: indicative public-source assessment.
- Disclaimer: results are advisory, not definitive; no uploads; matched signals listed.

**Acceptance Criteria (Status: Met)**
- User runs investigation and sees `Clean` or `Problematic` with comments and sources.
- Safety guard active (non-allegation comments when no signals; cautious language otherwise).
- Env templates updated; tests passing.

**Limitations (V1)**
- Source retrieval is stubbed; no live OSINT integrations or reranking.
- Risk scoring heuristic may require domain calibration.

**Refine → Restart Design**
- Integrate real OSINT fetchers and HF reranking; add caching and rate-limit enforcement.
- Expand rationale with credibility weighting and provenance display; support manual review lane.