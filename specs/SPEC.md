# ModelFacts Specification — v0.1.2

> *"Know the weights behind the words."*

ModelFacts is a compact companion to a model's existing card. It summarizes documented
architecture, provenance, limits, and reported evaluations in a short
`MODEL_FACTS.md` that sits beside the source card. It does not replace
[Hugging Face model cards](https://huggingface.co/docs/hub/en/model-cards) or their
YAML metadata. Those cards already carry license, task, dataset, and evaluation fields.
ModelFacts imports a consistent slice of that record and leaves usage notes, bias
writeups, and full evaluation reports on the source card.

It is the sibling label to [AppFacts](https://appfacts.dev). AppFacts describes the
**body** of software (what an app is built from). ModelFacts describes the
**brain** (architecture, training provenance, capabilities, and safety profile).

## File

A file named `MODEL_FACTS.md`, placed at the root of a model repository (or model-card
directory), alongside `README.md` / the model card. An application that ships or wraps a
model may also include one (or link to the model's canonical copy) so the intelligence
layer is documented next to the `APP_FACTS.md` that documents the stack.

## The Golden Rule

Put documented facts in the label. Marketing language stays out. A published number
needs a named source and the evaluated variant. When a fact is not public, write
`undisclosed` rather than guessing.

Capability and safety **levels** (`high` / `medium` / `low`, and the filter enum) are
fixed-vocabulary **assessments**. A closed enum makes files comparable. It does not
make a rating a measurement, and it does not create a ModelFacts test protocol.
Record the evidence basis next to each assessment (YAML comment, `capabilities.notes`,
or catalog `capability_basis`). If there is no published basis, say the field is
unresolved. Do not describe these ratings as inherently objective.

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

What the model can do **out of the box**, without external tools or plugins.
`vision_input`, `audio_input`, and `tool_use` record stated modalities and interfaces.
`reasoning_math` and `coding` are **assessments** on a closed enum so files are
comparable. They are not a reproducible ModelFacts protocol. These fields are required
in v0.1.0, so a file cannot omit them. Use `notes` (and comments in featured files)
for the evidence basis, or mark the reading unresolved.

| Key | Type | Required | Values |
|---|---|---|---|
| `natural_language` | enum | ✅ | `full`, `limited` |
| `reasoning_math` | enum | ✅ | `high`, `medium`, `low` (assessment) |
| `coding` | enum | ✅ | `high`, `medium`, `low` (assessment) |
| `vision_input` | enum | ✅ | `enabled`, `disabled` |
| `audio_input` | enum | ✅ | `enabled`, `disabled` |
| `tool_use` | enum | | `native`, `prompted`, `none` — function calling / structured tool use |
| `languages` | string | | e.g. `"8 languages officially supported"` |
| `notes` | string | | Evidence basis for assessments, plus stated nuance such as supported languages |

### `safety` (the "safety label")

The temperature of the model's built-in filters, for developers deciding whether they
must add their own guardrails. `refusal_sensitivity`, `instruction_following`, and
`filter_type` are **assessments**. They are required enums in v0.1.0. A listed value
without a published basis should be labeled unresolved in comments or nearby notes.
`hallucination_benchmark` is optional. Omit it when the evaluated artifact has no
named, sourced score. Do not invent one.

| Key | Type | Required | Values / description |
|---|---|---|---|
| `refusal_sensitivity` | enum | ✅ | `low`, `medium`, `high` (assessment of how aggressively it refuses prompts it deems harmful) |
| `instruction_following` | enum | ✅ | `high`, `medium`, `low` (assessment of adherence to system prompts vs pre-set weights) |
| `filter_type` | enum | ✅ | `raw`, `censored`, `hybrid` (assessment) |
| `hallucination_benchmark` | object | | Optional `{name, score}` copied from a named source for this variant |

### `benchmarks` (the "nutrition value")

Optional published scores for comparison. **0–10 items** of `{name, score, notes?}`.
Common names when the source reports them: `MMLU`, `GSM8K`, `HumanEval`,
`HumanPreference` (win-rate vs a stated baseline). ModelFacts does not define a
required benchmark suite. Omit a score rather than invent one.

Record the score as published. Use `notes` for shot count, metric, the evaluated
variant, and the named source (for example Meta's Llama 3.1 model card for
`Llama-3.1-70B-Instruct`). Say whether the figure is publisher-reported or
independently measured. A quantized, prompted, or locally modified artifact does not
inherit the base model's numbers unless that source evaluated that artifact.

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

- Follow the Golden Rule. Marketing language belongs in the README, not here.
- Fixed-vocabulary capability and safety ratings are assessments, not measurements.
- **`undisclosed` over omission** for facts the developer knowingly withholds
  (`parameters`, `tokens`, `data_composition`). The *absence* of a fact is itself a fact
  worth labeling. Capability and safety enums have no `undisclosed` value in v0.1.0.
  Label an unsupported reading as an assessment with an unresolved basis.
- Curate, don't dump: `data_composition` ≤ 8 rows, `benchmarks` ≤ 10 rows.
- One `MODEL_FACTS.md` per model *version*. A quantized re-release is a new file (the
  `quantization` field is precisely what changed). Do not copy the base file's scores
  onto that new file unless the source measured that quantization.
- Keep the body short enough to skim in under a minute.
- A file that passes the JSON Schema is well-formed. Schema validity is not a truth
  check.
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

- **This document:** v0.1.2 (assessment wording and model-card companion positioning).
- **Files** declare `model_facts_version` (currently `"0.1.0"`) so tooling can evolve
  independently of the prose document.
- Required-field list may still change before v1.0. v0.1.2 does not change the
  JSON Schema or existing enum values.

## Revision history

| Spec doc | Notes |
|---|---|
| **0.1.2** | Golden Rule distinguishes documented facts from assessments. Featured ratings need an evidence basis. Benchmarks bind to source and variant. Positioned as a companion to Hugging Face model cards. No schema migration. |
| **0.1.1** | Publication & discovery: card/directory pointers; link to suite discovery contract. |
| **0.1.0** | Initial specification, formalizing the concept draft ([`SPEC-draft.md`](./SPEC-draft.md)): frontmatter + rendered body, five fact groups (architecture, training, capabilities, safety, benchmarks), closed enums for levels, `undisclosed` convention. |

## License

CC0 — public domain. No attribution required.
