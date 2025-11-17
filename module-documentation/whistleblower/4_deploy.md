# Iteration: Deploy

- Frontend page available at `/tools/whistleblower`.
- Backend endpoint at `/api/whistleblower/analyze` included in both FastAPI entry points.

## Environment

- Backend `.env`:
  - `BACKEND_URL` for CORS alignment
  - `ALLOWED_ORIGINS` for permitted frontends
  - `HF_API_KEY` optional; `HF_MODEL` optional
  - `AG2_API_KEY` placeholder
  - `HF_INFERENCE_API_KEY` placeholder
  - `WHISTLEBLOWER_RATE_LIMIT` placeholder (not enforced yet)

## CORS

- Uses existing CORS setup; ensure frontend origin is included when deploying.

## Hosting

- Frontend on Vercel; backend on Render/Vercel-compatible FastAPI.
- Verify `BACKEND_URL` exposure to frontend (`NEXT_PUBLIC_BACKEND_URL` or `BACKEND_URL`) consistent with scribe tool logic.

## Runbooks

- If HF keys are present, comments upgrade to model-generated summaries.
- Without keys, fallback heuristics remain functional; no storage required.