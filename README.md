<h1 align="center">ModelFacts</h1>

<p align="center">
  <strong>A compact companion to a model card.</strong>
</p>

<p align="center">
  A tiny, standardized <code>MODEL_FACTS.md</code> that lives next to the source card
  and summarizes documented architecture, provenance, limits, and reported evaluations.
</p>

<p align="center">
  <a href="https://modelfacts.dev">modelfacts.dev</a> ·
  <a href="https://modelfacts.dev/directory/">Directory</a> ·
  <a href="./specs/SPEC.md">Spec</a> ·
  <a href="https://modelfacts.dev/schema/model-facts.schema.json">Schema</a> ·
  <a href="./examples/MODEL_FACTS.md">Example</a>
</p>

---

## What is this?

[AppFacts](https://appfacts.dev) is the label for the **body** of software, what an app is built from. **ModelFacts** is the label for the **brain**: a standardized, machine-parseable, human-readable summary of an AI model's architecture, training provenance, capabilities, and safety profile.

[Hugging Face model cards](https://huggingface.co/docs/hub/en/model-cards) already mix Markdown with structured YAML for license, task, datasets, and reported metrics. ModelFacts does not invent that metadata layer, and it does not replace the card. It keeps a compact, comparable slice next to the source, and it leaves usage notes, bias writeups, and full evaluation reports where they belong.

**The Golden Rule:** documented facts stay, marketing language stays out. Published scores need a named source and the evaluated variant. Capability and safety levels are fixed-vocabulary *assessments*, not measurements. A closed enum makes files comparable. It does not make a rating objective. When a fact isn't public, the file says `undisclosed`. Assessment fields may say `unresolved` when the card gives no basis.

Useful for:

- **Developers choosing a model** who need limits and provenance, not marketing
- **Teams deciding whether to add their own guardrails** (the safety profile says how the built-in ones are tuned)
- **AI agents** that need a fast, structured read on a model's shape
- **Fine-tuners** documenting exactly what changed from the base model

## What it looks like

Every `MODEL_FACTS.md` has two halves. The **YAML frontmatter is the source of truth** — structured and validatable. The **Markdown body is a rendered label** for humans.

```markdown
---
model_facts_version: "0.1.0"
name: Llama-3.1-70B-Instruct
developer: Meta
status: active
license: Llama 3.1 Community License
architecture:
  type: dense transformer (decoder-only)
  parameters: 70B
  context_window: 128k
  quantization: bf16
training:
  knowledge_cutoff: 2023-12
  methodology: pre-training → SFT → DPO
  tokens: 15T
capabilities:
  natural_language: full
  reasoning_math: high   # assessment: Meta GSM8K 95.1, 70B Instruct
  coding: high           # assessment: Meta HumanEval 80.5, 70B Instruct
  vision_input: disabled
  audio_input: disabled
safety:
  refusal_sensitivity: unresolved  # no publisher protocol
  instruction_following: high  # assessment: Meta IFEval 87.5, 70B Instruct
  filter_type: hybrid
benchmarks:
  - name: MMLU
    score: 83.6
    notes: Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 5-shot
generated:
  date: 2026-07-31
  generator: hand-authored
---

# Model Facts — Llama-3.1-70B-Instruct

| | |
|---|---|
| Parameters | 70B |
| Context window | 128k |
| ... | ... |
```

See the [full worked example](./examples/MODEL_FACTS.md), the [hand-authored template](./examples/MODEL_FACTS.template.md), and the [specification](./specs/SPEC.md) for the complete field list. The five fact groups:

| Group | The label's… | Answers |
|---|---|---|
| `architecture` | Base ingredients | What is it, physically? Parameters, context, quantization. |
| `training` | Data sourcing | What was it fed, and until when? Cutoff, methodology, composition. |
| `capabilities` | Functional limits | Stated modalities, plus assessments for reasoning and coding. |
| `safety` | Safety label | Assessments of built-in filters, for deciding on extra guardrails. |
| `benchmarks` | Nutrition value | Publisher-reported scores bound to a named source and variant. |

## Generating a label

You *can* hand-write `MODEL_FACTS.md` from the template, but the [generator](./generator/) drafts one for you — from a Hugging Face model card or a local Ollama model:

```bash
cd generator
pnpm install

# deterministic draft (no LLM) — judgment fields marked "# TODO: verify"
pnpm generate Qwen/Qwen2.5-7B-Instruct

# LLM-curated from the model card — local-first via Ollama,
# or openai / anthropic / xai / gemini
pnpm generate https://huggingface.co/Qwen/Qwen2.5-7B-Instruct \
  --provider ollama --model llama3.1

# from a local Ollama model (GGUF header facts: params, context, quant, license)
pnpm generate ollama:llama3.1 --provider ollama --model llama3.1
```

Deterministic facts (parameter count, context window, quantization, license, base model) come straight from structured metadata. Optional LLM curation is instructed to stay inside the card text and schema enums. That is a constraint, not a guarantee. A passing schema check means the file is well-formed, not that every value is true. Review the draft before you publish it. See [`generator/README.md`](./generator/README.md).

## Validating a file

The frontmatter conforms to [`site/schema/model-facts.schema.json`](./site/schema/model-facts.schema.json) (served at [modelfacts.dev/schema/model-facts.schema.json](https://modelfacts.dev/schema/model-facts.schema.json)) — any draft-07 validator works. This repo ships a small TypeScript CLI:

```bash
cd validator
pnpm install

# exit code 1 on any failure — CI-friendly
pnpm validate ../examples/MODEL_FACTS.md
pnpm validate path/to/your/MODEL_FACTS.md
```

## Directory

A curated catalog of labels for top open-weight and closed models ships at
[modelfacts.dev/directory](https://modelfacts.dev/directory/). Canonical files live in
[`directory/`](./directory/); the static site mirror is regenerated by
[`directory-tools/`](./directory-tools/). See [`specs/DIRECTORY_SPEC.md`](./specs/DIRECTORY_SPEC.md)
and the selection roadmap [`specs/DIRECTORY_SELECTION.md`](./specs/DIRECTORY_SELECTION.md).

```bash
pnpm directory:install
pnpm directory:apply-reviews   # write directory/<slug>/ from seed-catalog.ts
pnpm directory:sync            # validate + write site/directory/*
pnpm directory:refresh         # rescrape Ollama + Hugging Face Hub; write report
pnpm directory:rebuild         # refresh → apply-reviews → seed missing HF → sync
# (not `pnpm rebuild` — that is pnpm's native-module command)
```

Weekly cron / GitHub Action: `pnpm directory:rebuild`. New qualifying families are listed in `directory/refresh-report.json`; add them as drafts with `pnpm directory:rebuild -- --apply-new` (does not overwrite reviewed labels).

## Roadmap

- [x] Spec v0.1.0, canonical JSON Schema, worked examples
- [x] Schema validator CLI (TypeScript)
- [x] Generator: draft a `MODEL_FACTS.md` from a Hugging Face model card/URL or a local Ollama model, with optional LLM curation (ollama / openai / anthropic / xai / gemini)
- [x] Directory of labeled models (Ollama ≥250K/6mo open set + current closed flagships)
- [x] Directory decision surface Phases 1–5 (first publish stab; see [`specs/DIRECTORY_SELECTION.md`](./specs/DIRECTORY_SELECTION.md))
- [ ] More generator sources: OpenRouter, LM Studio, raw GGUF files
- [ ] Portable visual label (`/v#mf1.…` QR payload, no backend) and badges, mirroring AppFacts
- [ ] Measured-benchmark harness behind a future "certified" tier

## Website

The static site for [modelfacts.dev](https://modelfacts.dev) lives in [`site/`](./site/). Publish with `pnpm ship` (Wrangler Worker `model-facts`, uploads `site/` as static assets, no build step). Run `pnpm sync` in `directory-tools/` first if the catalog changed. Local preview: open [`model-facts.code-workspace`](./model-facts.code-workspace) and use Live Preview (`ms-vscode.live-server`), or `npx serve site -p 3002`.

| Path | Purpose |
|---|---|
| [`site/index.html`](./site/index.html) | Marketing / docs landing |
| [`site/directory/`](./site/directory/) | Generated catalog listing + per-model pages |
| [`site/schema/model-facts.schema.json`](./site/schema/model-facts.schema.json) | Canonical JSON Schema |

## Relationship to AppFacts

Same philosophy, same file shape (frontmatter + rendered body), same origin. AppFacts labels the **vehicle**; ModelFacts labels the **engine**. An app that ships a model can carry both files side by side. The original concept draft is preserved in [`SPEC-draft.md`](./SPEC-draft.md).

## Contributing

This is **v0.1.0** — the spec's required fields may still shift before v1.0. Issues and proposals on field taxonomy, capability/safety enums, and benchmark conventions are all welcome.

## License

- **Spec & schema:** [CC0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain) — adopt them freely, no attribution needed.
- **Tooling (validator):** MIT.

---

<p align="center">
  Part of <a href="https://modelfacts.dev">modelfacts.dev</a> · Sibling of <a href="https://appfacts.dev">appfacts.dev</a>
</p>

<p align="center">
  <em>"Know the weights behind the words."</em>
</p>

[See the rest of the Catalyst Forge shelf.](https://catalystforge.com/tools/)
