## Overview
- Implement the missing Medical Scribe API endpoints in the existing FastAPI backend, matching the frontend’s expected routes and payloads.
- Target endpoints: `POST /upload_init`, `POST /upload_chunk`, `POST /upload_finalize`, `POST /attribute`, `POST /summarize`.
- Use `requests` for Together AI calls (consistent with `app/services/welcome_service.py`) with robust fallbacks when no API key is set.

## Files To Add/Update
1. Add `backend/app/routers/scribe.py`
   - Define all five endpoints at the root (no prefix) to match the static client and React page.
   - Use Pydantic models for request/response validation.
2. Add `backend/app/services/scribe_service.py`
   - Business logic for chunked upload, speaker attribution, and SOAP summarization.
   - Provider selection: Together AI via `TOGETHER_API_KEY` or local heuristics when unset.
3. Add `backend/app/utils/uploads.py`
   - Helpers for chunk directory creation, chunk writes, and finalization under OS temp dir `msa_uploads`.
4. Update `backend/app/main.py`
   - Import and register the scribe router: `from app.routers import scribe` and `app.include_router(scribe.router)` (near `backend/app/main.py:18–32`).
5. Update `backend/main.py`
   - Also include the scribe router for direct `main:app` runs (`backend/main.py:30–31`).
6. Update `backend/.env.example`
   - Add `TOGETHER_API_KEY=your_together_key` and `MODEL=qwen2.5-3b-instruct`
   - Optional: `LOCAL_QWEN_URL` and `LOCAL_QWEN_CMD` for offline adapters (documented only; code supports HTTP URL fallback).

## Endpoints & Payloads
- `POST /upload_init` → `{ uploadId }`
  - Generate random `uploadId`; create temp dir `join(tmpdir(), 'msa_uploads', 'upload_<id>')`.
- `POST /upload_chunk?uploadId=...&index=...` (raw binary)
  - Write chunk to `chunk_<index>` in the upload dir; respond `{ ok: true, index }`.
- `POST /upload_finalize` → request `{ uploadId, filename? }`, response `{ fileId }`
  - Concatenate sorted chunks into a single file in `tmpdir()/msa_uploads` and return the absolute `fileId` path.
- `POST /attribute` → request `{ segments?: [{ ts, text }...], fileId?: string }`, response `{ dialogue, provider }`
  - If `TOGETHER_API_KEY` is set: call Together AI with an instruction to produce labeled turns (`[Clinician]` vs `[Patient]`).
  - If not set: heuristic fallback
    - If `segments` present: alternate speaker labels over segments or infer using simple keyword cues.
    - If `fileId` only: return a placeholder dialogue referencing the file id.
- `POST /summarize` → request `{ transcript: string, dialogue?: string, audioFileId?: string }`, response `{ note, provider }`
  - If `TOGETHER_API_KEY` present: call Together AI to produce a SOAP clinical note (Subjective, Objective, Assessment, Plan) from transcript/dialogue.
  - Heuristic fallback: parse `[Clinician]`/`[Patient]` lines; assemble SOAP sections with conservative defaults and concise bullet points.

## Together AI Integration (requests)
- Endpoint: `https://api.together.xyz/v1/chat/completions`
- Headers: `Authorization: Bearer <TOGETHER_API_KEY>`, `Content-Type: application/json`
- Body:
  - `model`: `os.environ.get('MODEL', 'qwen2.5-3b-instruct')`
  - `messages`: system prompt tailored for either attribution or summarization + user content (transcript/dialogue)
- Parse: `choices[0].message.content`; guard against malformed JSON/text; return `provider: 'together'` when successful.

## Pydantic Models
- Upload: `UploadInitResponse`, `UploadFinalizeRequest`, `UploadFinalizeResponse`.
- Attribution: `AttributeRequest`, `AttributeResponse`.
- Summarization: `SummarizeRequest`, `SummarizeResponse`.
- Keep schemas minimal and aligned to `BACKEND_MIGRATION.md` shapes to avoid frontend changes.

## Error Handling & Security
- Validate required params and return `400` with `{ error }` on missing `uploadId/index`.
- Timeouts on external calls (e.g., `timeout=30`); catch exceptions and return `{ provider: 'heuristic', ... }` fallback.
- Never log keys; only detect presence/absence.
- CORS already configured; leave as-is but keep origin tightening for prod.

## Testing & Verification
- Add `backend/tests/test_scribe.py`
  - Test upload init/chunk/finalize with small dummy data; expect `fileId` exists.
  - Test `POST /attribute` with `segments` input; expect labeled dialogue and `provider` set.
  - Test `POST /summarize` with a small transcript; expect all SOAP sections present.
- Manual validation (curl):
  - Upload: `curl -X POST http://localhost:8000/upload_init` and follow `BACKEND_MIGRATION.md` sample calls.
  - Summarize: `curl -X POST -H "Content-Type: application/json" -d '{"transcript":"[Clinician] ..."}' http://localhost:8000/summarize`
- Frontend check: set `apiBase` in local storage to FastAPI URL (e.g., `http://localhost:8000`) and confirm buttons work.

## Acceptance Criteria
- All five endpoints return the documented shapes and succeed with both Together-enabled and heuristic modes.
- Static demo (`frontend/public/scribe`) and React page (`frontend/app/tools/scribe/page.tsx`) can upload, attribute, and summarize successfully.
- No secrets exposed; `.env.example` updated for discoverability.

## Next Step
Confirm this plan to proceed with implementation and tests. Once approved, I will add the router, services, utilities, env example entries, and tests, then run local verification.