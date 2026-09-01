# ModelFacts directory (canonical labels)

This folder holds the **source-of-truth** `MODEL_FACTS.md` files for the public catalog
at [modelfacts.dev/directory](https://modelfacts.dev/directory).

See [`specs/DIRECTORY_SPEC.md`](../specs/DIRECTORY_SPEC.md) for layout, slugs, curation
levels, and how to add a model. Selection-surface roadmap:
[`specs/DIRECTORY_SELECTION.md`](../specs/DIRECTORY_SELECTION.md).

## Current seed criteria (2026-08)

**Open-weight / Ollama-listed:** models from
[ollama.com/search?o=newest](https://ollama.com/search?o=newest) and
[?o=popular](https://ollama.com/search?o=popular) with **≥ 250K pulls** and a library
update within roughly the **last 6 months**. Default: one representative size/tag per
family. **Exception:** deliberate size ladders where RAM vs quality matters (v0: Gemma 4
12B + 31B).

**Closed APIs:** current frontier flagships (GPT-5.6, Claude 5, Gemini 3.x, Grok 4.5) —
heavy on `undisclosed`, which is the point.

**Benchmarks:** include only scores published on the card/docs for that version. No
required shared bench set yet — omit rather than invent. Scores are as-published, not
ModelFacts-run.

Membership and pull notes live in [`manifest.json`](./manifest.json). Label bodies are
authored in [`directory-tools/src/seed-catalog.ts`](../directory-tools/src/seed-catalog.ts).

## Quick commands

From the repo root:

```bash
pnpm directory:install
pnpm directory:apply-reviews   # write directory/<slug>/MODEL_FACTS.md from seed-catalog
pnpm directory:sync            # validate + write site/directory/*
pnpm directory:refresh         # rescrape Ollama popular/newest; update pull counts
pnpm directory:rebuild         # refresh + apply-reviews + seed + sync (weekly; not pnpm's `rebuild`)
```

`refresh` writes [`refresh-report.json`](./refresh-report.json) (new candidates, stale entries, HF hints).
`--apply-new` adds qualifying new families as **draft** labels; reviewed `seed-catalog.ts` overlays stay put.

The static site mirror under `site/directory/` is generated — do not hand-edit it.
