# Directory Selection Surface — Roadmap Spec v0.1.0

> Make [modelfacts.dev/directory](https://modelfacts.dev/directory) a **decision
> surface** for humans and agents picking a model for a task — not only an inventory
> of nutrition labels.
>
> Companion to [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md) (catalog mechanics) and
> [`SPEC.md`](./SPEC.md) (per-file format).

## Status

Phases 1–5 implemented for the first public stab (`directory_version` 0.3.0).
Enum policy **B**; Phase 5 kept modest (Gemma 4 12B+31B ladder). Revisit after user feedback.

## Problem

As of the v0 directory seed (~24 models), the site is a good **inventory + disclosure**
surface and a weak **selection** surface.

What works today:

- `/directory/index.json` + URL query filters (shareable, agent-fetchable)
- Honest `undisclosed` for closed labs next to open peers
- Per-model `facts.json` / `MODEL_FACTS.md` after a shortlist

What fails for “pick a model for this task”:

1. **Capability enums barely discriminate** — most entries are `reasoning_math: high`
   and `coding: high`, so expert filters return nearly everything.
2. **Decision fields are missing from the catalog** — agents rarely start with
   “min params”; they need call targets, cost/local cost proxies, license posture,
   knowledge cutoff, speed tier.
3. **No task → shortlist path** — filters are axis-aligned; there are no presets for
   jobs like “local coding agent ≤24GB” or “long-doc RAG 200k+.”
4. **Listing rows hide filtered axes** — vision/tools/reasoning can be constrained in
   the URL, but the table still shows params / context / filter / access only.
5. **No compare** — serial detail pages force N round-trips for a 2–4 model shortlist.
6. **“Reviewed” without surface provenance** — judgment fields read like measurements;
   closed labels especially need claim → source linkage or more `undisclosed` /
   `claimed` marking.
7. **Benchmarks sparse / non-comparable** — schema allows them; seed often omits them;
   no shared subset for tradeoffs.
8. **Catalog composition fights tradeoffs** — one size per family; many closed models
   have `parameters_b: null` (correct) without UI explanation that min-params excludes them.

## Goals

| Goal | Success signal |
|---|---|
| Agents shortlist from `index.json` alone | Typical task → ≤5 candidates without opening HTML |
| Humans see differentiators in the table | After a filter, rows show tools/vision/cutoff/license (or equivalent), not only size |
| Enums earn trust or get demoted | Either discriminative + provenance-backed, or clearly labeled as claims |
| Task language maps to URL state | At least a small set of presets → filter params |
| Compare without leaving the site | 2–4 models side by side on the same fields |

## Non-goals (this roadmap)

- A live benchmark harness or “certified” tier (still future; see directory curation rules).
- Inventing closed-lab parameter counts, prices, or VRAM when unpublished.
- Turning the directory into a full model marketplace / chat UI.
- Changing the Golden Rule in [`SPEC.md`](./SPEC.md) — new **directory-only** fields
  may live in `index.json` / manifest without forcing every field into `MODEL_FACTS.md`
  until the format spec is intentionally versioned.

## Design principles

1. **Selection fields may be directory-only** until they prove durable enough for
   `MODEL_FACTS.md` / schema bump.
2. **Prefer `undisclosed` / `null` over guesses** — but explain filter exclusions in UX
   (“N models omitted: params undisclosed”).
3. **Show what you filter on** — listing columns should include the axes agents care about.
4. **Agents get a stable contract** — document `index.json` shape + filter params at a
   well-known URL; keep HTML optional.
5. **Credibility over confidence** — do not leave every frontier model at `high`/`high`
   without evidence or relative ranking.

---

## Phases

### Phase 1 — Catalog enrichments + denser listing rows

**Intent:** Highest leverage with least philosophy. Make `index.json` and the table
answer “where do I get it, what’s the cutoff, can I use it commercially, what modalities?”

**Deliverables**

1. **Extend catalog entries** in `index.json` (and sync from labels/manifest as needed):

   | Field | Type | Notes |
   |---|---|---|
   | `knowledge_cutoff` | string \| `null` | From `training.knowledge_cutoff`; `null` if undisclosed |
   | `api_ids` | string[] | Provider model ids / routing strings when known (e.g. `gpt-5.6-sol`) |
   | `ollama_tag` | string \| `null` | Library tag when the open seed is Ollama-backed |
   | `hf_id` | string \| `null` | `org/name` when weights are on Hugging Face |
   | `commercial_ok` | `yes` \| `no` \| `conditional` \| `undisclosed` | Derived from license + published terms; never invent |
   | `price_tier` | `free_local` \| `api_budget` \| `api_standard` \| `api_premium` \| `undisclosed` | Coarse tier only; optional until sourced |
   | `vram_gb_q4` | number \| `null` | Rough local proxy for open weights; `null` if unknown |
   | `speed_tier` | `flash` \| `standard` \| `flagship` \| `undisclosed` | Relative within catalog, not absolute latency |

   Exact enum names may be adjusted in implementation; document the final shape in
   [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md) and bump `directory_version` if breaking.

2. **Denser listing rows** — add columns (or compact badges) for at least:
   tools, vision, knowledge cutoff, commercial posture (or license class), and one
   differentiator (speed tier or price tier). Keep the table scannable; no card grid.

3. **Filter UX honesty** — when `min_params` (or similar) excludes models with `null`
   numeric fields, surface a short count/reason near the result count.

4. **Seed data pass** — fill new fields for the current ~24 models from published
   sources only; leave gaps as `undisclosed` / `null`.

5. **Spec sync** — update [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md) catalog schema +
   filter params if any new query keys are added (e.g. `commercial`, `max_vram`).

**Exit criteria**

- [x] `index.json` includes the Phase 1 fields for all catalog entries
- [x] Listing shows decision columns without opening detail pages
- [x] Closed models with null params are explained when param filters are active
- [x] `DIRECTORY_SPEC.md` documents the new catalog shape

**Out of scope for Phase 1:** compare view, task presets, enum recalibration, benchmarks.

---

### Phase 2 — Credibility and capability signal

**Intent:** Stop pretending three-level self-grades are calibrated measurements.

**Deliverables**

1. **Provenance on judgment fields** — on detail pages (and optionally in
   `facts.json` / catalog), link claim → source (system card, model card section, docs).
   Minimum: a “Sources for judgments” block when `curation: reviewed`.
2. **Enum policy** — either:
   - **(A)** Recalibrate relative to the catalog (force a spread; document method), or
   - **(B)** Demote listing/filter emphasis on `reasoning_math` / `coding` until evidence
     exists, and prefer objective filters (context, modalities, tools, cutoff, access).
3. **Claim vs measured language** — UI copy and agent docs state that capability/safety
   enums are published-claim readings, not ModelFacts-run evals.
4. **Optional schema/directory field** `capability_basis: claimed | reviewed_claim |
   measured` (measured reserved for future harness).

**Exit criteria**

- [x] Reviewed labels expose judgment provenance or explicitly mark gaps
- [x] Expert filters no longer imply false precision when the catalog is flat
- [x] Landing/directory copy does not oversell enums as benchmarks

**Decision:** Policy **B** (demote claimed levels; prefer objective filters).

---

### Phase 3 — Task presets + compare

**Intent:** Map task language to URL state; support shortlist comparison.

**Deliverables**

1. **Task presets** — a small set of chips or links that set filter params, e.g.:
   - Local coding agent (open + tools + min coding + optional max VRAM)
   - Long-context RAG (min context 128k / 200k / 1M)
   - Vision + tools
   - Low-refusal / creative (filter + refusal axes — carefully worded)
   - Frontier API (closed + flagship speed tier)
2. **Presets are URL-only** — no backend; each preset is a documented query string.
3. **Compare view** — select 2–4 models from the listing; `/directory/compare/?ids=a,b,c`
   (or equivalent) renders a side-by-side table of shared fields from `index.json` /
   `facts.json`.
4. **Deep links** — compare and preset URLs are shareable and documented for agents.

**Exit criteria**

- [x] ≥4 presets live and documented
- [x] Compare supports 2–4 models without scraping detail HTML
- [x] Agent guide (Phase 4) can point at presets + compare contracts

---

### Phase 4 — Agent contract (`llms.txt` / guide)

**Intent:** Make the machine path obvious without reading the marketing site.

**Deliverables**

1. Well-known doc(s), e.g.:
   - `site/llms.txt` and/or `site/directory/AGENTS.md`
2. Contents:
   - Fetch `/directory/index.json`
   - Filter fields and URL params
   - Open `/directory/<slug>/facts.json` for full label
   - Phase 3 presets + compare URLs
   - Golden Rule + `undisclosed` semantics
3. Link from directory expert panel / footer (human discoverability).

**Exit criteria**

- [x] Stable URLs return the agent guide
- [x] A new agent can shortlist without reading `DIRECTORY_SPEC.md` in git

---

### Phase 5 — Catalog composition + shared evidence

**Intent:** Give the catalog the shapes selection actually needs.

**Deliverables**

1. **Size ladders** where families matter (e.g. 7B / 32B / 70B) instead of only one
   representative size when the tradeoff is RAM vs quality.
2. **API ↔ open pairing** notes in catalog metadata when a closed API and an open
   weight model are the same product family (links, not invented equivalence).
3. **Shared benchmark subset** — when published scores exist on a common bench, include
   them consistently; otherwise omit and say so. No invented scores.
4. Revisit Ollama-traction-only open selection if it systematically excludes models
   agents need (HF-first coding models, etc.) — document revised curation criteria in
   [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md) / `directory/README.md`.

**Exit criteria**

- [x] At least one family has a deliberate size ladder in the catalog (Gemma 4 12B + 31B)
- [x] Benchmark policy documented and applied to new seeds
- [x] Curation criteria updated if selection set changes

**Modest default:** no full re-seed; family/`related_slugs` on existing pairs; Gemini ≠ Gemma.

---

## Suggested sequencing

```text
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4 (full)  →  Phase 5
                ↘ optional early llms.txt stub
```

Do **not** start Phase 3 UI until Phase 1 fields exist (compare/presets need them).
Phase 2 can overlap late Phase 1 (provenance copy) but enum policy should land before
leaning harder on capability filters in presets.

## Relationship to other specs

| Doc | Role |
|---|---|
| [`SPEC.md`](./SPEC.md) | Per-file format; bump only if selection fields graduate into labels |
| [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md) | Normative catalog/site mechanics; updated as phases land |
| This document | Roadmap + product requirements for the decision surface |

## Versioning

- **This document:** v0.1.0 (roadmap draft).
- Bump when phase scope or field contracts change before/during implementation.
- Catalog JSON `directory_version` bumps are owned by [`DIRECTORY_SPEC.md`](./DIRECTORY_SPEC.md).

## Revision history

| Version | Notes |
|---|---|
| **0.2.0** | Phases 2–5 marked done for first publish stab (`directory_version` 0.3.0). |
| **0.1.1** | Phase 1 marked done (`directory_version` 0.2.0). |
| **0.1.0** | Initial roadmap from agent critical pass: inventory vs decision surface, five phases. |

## License

CC0 — public domain, same as the ModelFacts spec & schema.
