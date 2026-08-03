# ModelFacts directory (canonical labels)

This folder holds the **source-of-truth** `MODEL_FACTS.md` files for the public catalog
at [modelfacts.dev/directory](https://modelfacts.dev/directory).

See [`DIRECTORY_SPEC.md`](../DIRECTORY_SPEC.md) for layout, slugs, curation levels, and
how to add a model.

## Quick commands

```bash
cd directory-tools
pnpm install

# draft any missing open-weight labels from Hugging Face
pnpm seed

# apply human-reviewed overlays + write closed API labels
pnpm apply-reviews

# validate and regenerate site/directory/*
pnpm sync
```

Membership and directory metadata live in [`manifest.json`](./manifest.json).
The static site mirror under `site/directory/` is generated — do not hand-edit it.
