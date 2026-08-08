# ModelFacts Specification — v0.1.1

> *"Know the weights behind the words."*

ModelFacts is a "Nutrition Facts" label for AI models — the sibling standard to
[AppFacts](https://appfacts.dev). AppFacts describes the **body** of software (what an app
is built from); ModelFacts describes the **brain** (what went into a model's intelligence
layer: architecture, training provenance, capabilities, and safety profile).

## File

A file named `MODEL_FACTS.md`, placed at the root of a model repository (or model-card
directory), alongside `README.md` / the model card. An application that ships or wraps a
model may also include one (or link to the model's canonical copy) so the intelligence
layer is documented next to the `APP_FACTS.md` that documents the stack.

## The Golden Rule

If a piece of information is **subjective** (*"this model is very creative"*), it does
**not** belong in ModelFacts. If it is **objective** (*"trained on 15T tokens with a 128k
context window"*), it does. When an objective fact is not publicly disclosed, say so
explicitly (`undisclosed`) rather than guessing.

## Structure

The file has two parts:

1. **YAML frontmatter** — the **sole source of truth**. Structured, validated,
   machine-parseable.
2. **Markdown body** — a **rendered view** of the frontmatter for humans
   (nutrition-label style).

Hand edits to the body are fine for local readability, but the body **MAY drift** from the
frontmatter if either side is edited by hand. Tooling does **not** verify
body-vs-frontmatter consistency; regenerating the body from the frontmatter is how you
resync.

## Required frontmatter fields

| Field | Type | Description |
|---|---|---|
| `model_facts_version` | string | Spec version this *file* conforms to, e.g. `"0.1.0"` |
| `name` | string | Official model name and version, e.g. `Llama-3.1-70B-Instruct` |
| `developer` | string | Organization (or person) that trained/released the model |
| `status` | enum | One of: `active`, `deprecated`, `preview`, `archived` |
| `license` | string | SPDX identifier or the license's official name, e.g. `"Apache-2.0"`, `"Llama 3.1 Community License"`, or `"UNKNOWN"` |
| `architecture` | object | The core architecture — see below. |
| `training` | object | Training provenance — see below. |
| `capabilities` | object | Capability matrix — see below. |
| `safety` | object | Safety & guardrail profile — see below. |
| `generated` | object | `date`, `generator` |

### `architecture` (the "base ingredients")

The physical existence of the model — its weight and form.

| Key | Type | Required | Description |
|---|---|---|---|
| `type` | string | ✅ | Structural framework, e.g. `dense transformer (decoder-only)`, `mixture of experts (MoE)`, `state space (Mamba)` |
| `parameters` | string | ✅ | Total trainable parameters, e.g. `"70B"`, `"8x22B"`, `"undisclosed"` |
| `active_parameters` | string | | Parameters active per token (MoE), e.g. `"39B"` |
| `context_window` | string | ✅ | Max tokens per inference, e.g. `"128k"` |
| `quantization` | string | ✅ | Precision as distributed, e.g. `"bf16"`, `"4-bit (GPTQ)"`, `"GGUF Q4_K_M"` |
| `modalities_in` | string list | | e.g. `[text, image]` (default assumption: `[text]`) |
| `modalities_out` | string list | | e.g. `[text]` |

### `training` (the "data sourcing")

The most important distinction from a standard model card: not "trained on the internet"
but *what specific types of data were weighted, and when collection stopped*.

| Key | Type | Required | Description |
|---|---|---|---|
| `knowledge_cutoff` | string | ✅ | Date training-data collection ended, `YYYY-MM` or `YYYY-MM-DD`, or `"undisclosed"` |
| `methodology` | string | ✅ | Pipeline, e.g. `"pre-training → SFT → DPO"` |
| `tokens` | string | | Total training tokens, e.g. `"15T"`, `"undisclosed"` |
| `data_composition` | list | | 0–8 items of `{component, percent, source_type, purpose}` — see below |

**`data_composition` items** mirror the composition table from the concept draft:

| Key | Type | Description |
|---|---|---|
| `component` | string | e.g. `general web`, `code`, `academic/math`, `synthetic`, `human feedback` |
| `percent` | number or `"undisclosed"` | Contribution to the training mix |
| `source_type` | string | e.g. `scraped/licensed text`, `public repositories`, `RLHF / DPO` |
| `purpose` | string | e.g. `general knowledge`, `logic and syntax`, `alignment` |

Percentages that are disclosed SHOULD sum to ≤ 100. Omit the list entirely (or use
`percent: undisclosed`) when the developer has not published the mix — never invent
numbers.

### `capabilities` (the "functional limits")

What the model can do **out of the box**, without external tools or plugins. Levels are a
closed enum so files are comparable.

| Key | Type | Required | Values |
|---|---|---|---|
| `natural_language` | enum | ✅ | `full`, `limited` |
| `reasoning_math` | enum | ✅ | `high`, `medium`, `low` |
| `coding` | enum | ✅ | `high`, `medium`, `low` |
| `vision_input` | enum | ✅ | `enabled`, `disabled` |
| `audio_input` | enum | ✅ | `enabled`, `disabled` |
| `tool_use` | enum | | `native`, `prompted`, `none` — function calling / structured tool use |
| `languages` | string | | e.g. `"8 languages officially supported"` |
| `notes` | string | | One line of objective nuance, e.g. supported programming languages |

### `safety` (the "safety label")

The "temperature" of the model's built-in filters — vital for developers deciding whether
they must add their own guardrails.

| Key | Type | Required | Values / description |
|---|---|---|---|
| `refusal_sensitivity` | enum | ✅ | `low`, `medium`, `high` — how aggressively it refuses prompts it deems harmful |
| `instruction_following` | enum | ✅ | `high`, `medium`, `low` — adherence to system prompts vs. pre-set weights |
| `filter_type` | enum | ✅ | `raw`, `censored`, `hybrid` |
| `hallucination_benchmark` | object | | `{name, score}` from a standardized benchmark, e.g. `{name: TruthfulQA, score: 0.62}` |

### `benchmarks` (the "nutrition value")

Optional but strongly recommended — standardized metrics for objective comparison.
**0–10 items** of `{name, score, notes?}`. Recommended names: `MMLU`, `GSM8K`,
`HumanEval`, `HumanPreference` (win-rate vs. a stated baseline). Record the score as
published, and use `notes` for shot count / variant (e.g. `5-shot`, `pass@1`).

## Optional fields

| Field | Type | Description |
|---|---|---|
| `release_date` | string (date) | First public release of this version |
| `homepage` | string (URL) | |
| `repository` | string (URL) | Code / model repo |
| `weights` | string (URL) | Where the weights live (e.g. Hugging Face), when open |
| `base_model` | string | For fine-tunes: the model this derives from |
| `benchmarks` | list | See above |
| `credits.generated_with` | string (URL) | e.g. `"https://modelfacts.dev"` |
| `credits.built_by` | string | Author name + link |

## Conventions

- **Objective facts only** (the Golden Rule). Marketing language and vibes belong in the
  README, not here.
- **`undisclosed` over omission** for facts the developer knowingly withholds
  (`parameters`, `tokens`, `data_composition`) — the *absence* of a fact is itself a fact
  worth labeling.
- Curate, don't dump: `data_composition` ≤ 8 rows, `benchmarks` ≤ 10 rows.
- One `MODEL_FACTS.md` per model *version*. A quantized re-release is a new file (the
  `quantization` field is precisely what changed).
- Keep the body short enough to skim in under a minute.
- **Canonical schema URL** (matches the schema `$id`):
  [`https://modelfacts.dev/schema/model-facts.schema.json`](https://modelfacts.dev/schema/model-facts.schema.json)
  Source in this repo: [`site/schema/model-facts.schema.json`](../site/schema/model-facts.schema.json).

## Publication & discovery

Suite contract: [x-facts `DISCOVERY-AND-PUBLICATION.md`](../../x-facts/specs/DISCOVERY-AND-PUBLICATION.md).

| | |
|---|---|
| **Canonical file** | Model repo / model-card directory `MODEL_FACTS.md` |
| **Primary pointer** | Lab or hub model card link to that file |
| **Cold-start** | Seeded [directory](https://modelfacts.dev/directory/) when upstream cards do not link out |
| **Viewer** | Optional later; catalog + `facts.json` remain the agent path for now |

Cross-package refs to a model label **SHOULD** use an `https://` URL to the canonical file (or a stable directory entry that resolves to it).

## Versioning

- **This document:** v0.1.1 (publication & discovery; see revision history).
- **Files** declare `model_facts_version` (currently `"0.1.0"`) so tooling can evolve
  independently of the prose document.
- Required-field list may still change before v1.0.

## Revision history

| Spec doc | Notes |
|---|---|
| **0.1.1** | Publication & discovery: card/directory pointers; link to suite discovery contract. |
| **0.1.0** | Initial specification, formalizing the concept draft ([`SPEC-draft.md`](./SPEC-draft.md)): frontmatter + rendered body, five fact groups (architecture, training, capabilities, safety, benchmarks), closed enums for levels, `undisclosed` convention. |

## License

CC0 — public domain. No attribution required.
