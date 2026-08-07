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
update within roughly the **last 6 months**. One representative size/tag per family.

**Closed APIs:** current frontier flagships (GPT-5.6, Claude 5, Gemini 3.x, Grok 4.5) —
heavy on `undisclosed`, which is the point.

Membership and pull notes live in [`manifest.json`](./manifest.json). Label bodies are
authored in [`directory-tools/src/seed-catalog.ts`](../directory-tools/src/seed-catalog.ts).

## Quick commands

```bash
cd directory-tools
pnpm install
pnpm apply-reviews   # write directory/<slug>/MODEL_FACTS.md from seed-catalog
pnpm sync            # validate + write site/directory/*
```

The static site mirror under `site/directory/` is generated — do not hand-edit it.
