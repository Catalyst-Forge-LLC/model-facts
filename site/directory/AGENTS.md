# ModelFacts directory — agent guide

Machine-readable path for shortlisting models. Prefer this over scraping HTML.

## Quick path

1. `GET https://modelfacts.dev/directory/index.json`
2. Filter on objective fields first: `weight_access`, `context_tokens`, `tool_use`,
   `vision_input`, `vram_gb_q4`, `commercial_ok`, `speed_tier`, `knowledge_cutoff`,
   `api_ids`, `ollama_tag`, `hf_id`
3. Open `/directory/<slug>/facts.json` for the full label (frontmatter as JSON)
4. Optional: raw Markdown at `/directory/<slug>/MODEL_FACTS.md`

Local mirror: same paths under your static site root (`site/`).

## Semantics

- **Golden Rule:** objective facts only. Missing public facts are `undisclosed` (or `null`
  in numeric filter fields) — do not invent sizes, prices, or cutoffs.
- **`capability_basis`:** `reviewed_claim` | `claimed` | `measured` (measured unused until
  a harness exists). Reasoning/coding/refusal enums are **published-claim readings**, not
  calibrated rankings. The v0 catalog is mostly flat (`high`); do not treat them as
  discriminative scores.
- **`commercial_ok`:** coarse license posture, not legal advice.
- **`vram_gb_q4` / `price_tier` / `speed_tier`:** coarse proxies for selection, not SLAs.

## URL filters (listing)

Shareable query params on `/directory/`:

| Param | Notes |
|---|---|
| `access` | `open` \| `closed` |
| `q` | name / slug / api id / ollama / hf |
| `developer` | exact |
| `min_params` | billions; excludes undisclosed params |
| `min_context` | tokens; excludes undisclosed context |
| `max_vram` | GB Q4 proxy; excludes unknown VRAM |
| `commercial` | exact `commercial_ok` |
| `speed` | `flash` \| `standard` \| `flagship` |
| `filter` | safety `raw` \| `hybrid` \| `censored` |
| `vision` / `audio` | `1` |
| `tools` | `any` \| `native` |
| claimed levels | `min_reasoning`, `min_coding`, `refusal`, `instruction` (weak signal) |

## Task presets

| Task | URL |
|---|---|
| Local coding ≤24GB | `/directory/?access=open&tools=native&max_vram=24` |
| Long-context 200k+ | `/directory/?min_context=200000` |
| Vision + tools | `/directory/?vision=1&tools=native&expert=1` |
| Raw / lightly filtered | `/directory/?filter=raw` |
| Frontier API | `/directory/?access=closed&speed=flagship` |

## Compare

`/directory/compare/?ids=slug-a,slug-b[,slug-c][,slug-d]` — 2–4 slugs, fields from `index.json`.

## Related docs

- Format: `https://github.com/Catalyst-Forge-LLC/model-facts/blob/main/specs/SPEC.md`
- Directory mechanics: `.../specs/DIRECTORY_SPEC.md`
- Selection roadmap: `.../specs/DIRECTORY_SELECTION.md`
- Site root agent pointer: `/llms.txt`
