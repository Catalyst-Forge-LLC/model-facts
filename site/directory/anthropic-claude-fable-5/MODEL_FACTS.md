---
model_facts_version: 0.1.0
status: active
name: Claude Fable 5
developer: Anthropic
license: Proprietary (API)
release_date: 2026-06-09
homepage: https://platform.claude.com/docs/en/about-claude/models/overview
architecture:
  type: undisclosed (decoder-only LLM)
  parameters: undisclosed
  context_window: 1M
  quantization: n/a (API-served)
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: 2026-01
  methodology: pre-training on proprietary mix of public web, private datasets, and synthetic data → Constitutional AI / post-training alignment (per Anthropic system cards)
  tokens: undisclosed
  data_composition:
    - component: general web
      percent: undisclosed
      source_type: ClaudeBot crawl of public sites (robots.txt respected)
      purpose: general knowledge
    - component: public and private datasets
      percent: undisclosed
      source_type: licensed / curated corpora
      purpose: coverage and quality
    - component: synthetic
      percent: undisclosed
      source_type: model-generated
      purpose: capability and alignment data
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: "Top GA Claude 5 tier; adaptive thinking always on; max output 128k. System card: anthropic.com/system-cards"
safety:
  refusal_sensitivity: high
  instruction_following: high
  filter_type: censored
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Claude Fable 5

| | |
|---|---|
| **Developer** | Anthropic |
| **Status** | active |
| **License** | Proprietary (API) |
| **Released** | 2026-06-09 |

## Architecture

| | |
|---|---|
| Type | undisclosed (decoder-only LLM) |
| Parameters | undisclosed |
| Context window | 1M |
| Quantization | n/a (API-served) |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | 2026-01 |
| Methodology | pre-training on proprietary mix of public web, private datasets, and synthetic data → Constitutional AI / post-training alignment (per Anthropic system cards) |
| Tokens | undisclosed |

| Component | % | Source | Purpose |
|---|---|---|---|
| general web | undisclosed | ClaudeBot crawl of public sites (robots.txt respected) | general knowledge |
| public and private datasets | undisclosed | licensed / curated corpora | coverage and quality |
| synthetic | undisclosed | model-generated | capability and alignment data |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | enabled |
| Audio (input) | disabled |
| Tool use | native |

*Top GA Claude 5 tier; adaptive thinking always on; max output 128k. System card: anthropic.com/system-cards*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | censored |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
