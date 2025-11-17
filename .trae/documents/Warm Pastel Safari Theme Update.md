## Overview

* Migrate the Whistleblower pipeline to an AG2-style agentic workflow: a directed graph of specialized agents that plan, search, cross‑verify, and synthesize results with iterative reflection. Keep the existing API contract while swapping orchestration to AG2.

## Agent Roles

* Controller: coordinates the graph, sets budgets, retries, and termination conditions.

* Planner: expands the user query into sub‑tasks (aliases, jurisdiction, domain signals).

* WebSearch Agent: pulls top results via Google CSE or Brave Search (API keys optional). De‑dupes and normalizes fields.

* Sanctions Agent: matches entity using OpenSanctions `/match` and tags programs.

* Regulators Agent (Phase 2): queries SEC EDGAR (company search, enforcement/8‑K), FCA FS Register for UK entities.

* News Agent: queries NewsCatcher v3 for reputable coverage, applies outlet reliability weighting.

* Complaints Agent (Phase 2): FTC datasets and BBB (where available) as lower‑confidence signals.

* Domain Agent: WHOIS/DNS checks (SPF/DMARC), supportive context only.

* Deduper: canonicalizes URLs/domains and merges evidence.

* Judge/Scorer: classifies categories and assigns `severity` (0–3) and `confidence` (0–1) based on source tier.

* Summarizer: produces a concise evidence‑only summary with citations (reuses HF chat completions with strict prompts).

* Safety/Policy: filters out non‑verifiable social claims; ensures only sources with URLs are surfaced.

## Orchestration (AG2 Graph)

* Graph nodes: Planner → {WebSearch, Sanctions, News, Domain, (Regulators, Complaints)} in parallel → Deduper → Judge/Scorer → Summarizer.

* Concurrency: run source agents in parallel with per‑agent timeouts and rate limits.

* Reflection loop: if Judge finds severity ≥2 with weak confidence (<0.6), Planner triggers a focused second pass (e.g., restrict to major outlets/regulators) up to one retry.

* Termination: stop when confidence‑weighted evidence reaches threshold or retries exhausted.

## Integration Details

* Wrap existing source modules as AG2 tools:

  * `search.top_results(q, n)` → WebSearch Tool

  * `regulators.check_opensanctions(name, type)` → Sanctions Tool

  * `news.search_news(name, n)` → News Tool

  * `domain.check_domain(domain)` → Domain Tool

* Add AG2 runner in backend services (no API change): Controller invokes agents, collects outputs, and returns the same JSON shape.

* Maintain environment‑driven enablement; if a key is missing, the corresponding agent yields no data.

## Scoring & Clean Rule

* Source tiers:

  * Regulators/Sanctions: severity 3, confidence 0.9–1.0

  * Major outlets: severity 2–3, confidence 0.7–0.9

  * Curated news APIs: severity 2, confidence 0.6–0.8

  * Complaints: severity 1, confidence 0.3–0.6

  * Domain: severity 1, confidence 0.3–0.5

* Clean shows only if no flags with severity ≥2 and total score below threshold.

## Frontend

* Keep existing page; optionally add filter chips (Regulators, Sanctions, News, Complaints, Domain) and show agent badges.

* Optional: stream progress (Planner → Agents → Summary) using incremental updates.

## Config & Keys

* `GOOGLE_API_KEY`, `GOOGLE_CSE_ID`; `BRAVE_API_KEY` (alternative)

* `OPENSANCTIONS_API_KEY`

* `NEWS_API_KEY`

* Respect SEC user‑agent guidance for EDGAR when added.

## Reliability

* Per‑agent timeouts, exponential backoff; short‑lived cache per `(name,type,country)` for 24h.

* Deterministic merges; source‑level rate limits.

## Testing

* Unit tests for agent classification and scoring edges.

* Integration tests with mocked responses (Sanctions, Search, News).

* Golden samples: one controversial entity, one clean entity.

## Rollout

* Phase 1: Introduce Controller, Planner, parallel Web/Sanctions/News/Domain agents; replace internal orchestrator with AG2 graph.

* Phase 2: Add Regulators (SEC, FCA) and Complaints agents; UI filters and badges.

* Phase 3: Caching, robust retries, tests, and optional progress streaming.

## Acceptance Criteria

* Multi‑source agentic scan returns evidence with categories, severity, confidence, and URLs.

* Clean indicator only when severity and score thresholds are met.

* Graceful operation with missing keys; stable latency and clear citations.

