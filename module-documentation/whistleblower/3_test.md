# Iteration: Test

- Added `backend/tests/test_whistleblower_agent.py` covering input validation, verdict mapping, and source attribution.

## Failed Tests (and Fixes)

- `test_verdict_mapping_problematic` initially failed: single-signal contexts (e.g., "fraud investigation") produced `risk_score=0.32` → `Clean`.
  - Fix: increased base and per-hit weights to `risk_score = 0.3 + 0.2 * hits` (capped at `0.95`).
  - Result: single strong signals now map to `Problematic` (`risk_score ≥ 0.5`).

## Quality Enhancements

- Transparent flags returned (`matched` list, `hits`, `risk`) for UI explanation.
- Deterministic source stubs ensure reliable tests without external keys.

## Human Testing Outcomes

- Searching for a real individual name resulted in model-written comments with speculative phrasing.
  - Mitigation: when `hits == 0`, bypass model summarization and return deterministic, non-allegation comments with explicit disclaimer and “Matched signals: none”.
  - Prompt tightened for `hits > 0`: instructs “Only reference matched signals; do not invent facts.”
  - Outcome: personal-name searches now avoid hallucinations; comments remain cautious and non-defamatory when no signals are matched.