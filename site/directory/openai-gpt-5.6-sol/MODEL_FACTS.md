---
model_facts_version: 0.1.0
status: active
name: GPT-5.6 Sol
developer: OpenAI
license: Proprietary (API)
release_date: 2026-07-09
homepage: https://developers.openai.com/api/docs/models/gpt-5.6-sol
architecture:
  type: undisclosed (transformer-family)
  parameters: undisclosed
  context_window: 1.05M
  quantization: n/a (API-served)
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: 2026-02-16
  methodology: pre-training on public web + partner + user/trainer data → filtering → RL for reasoning chains (per GPT-5.6 system card)
  tokens: undisclosed
  data_composition:
    - component: public internet
      percent: undisclosed
      source_type: scraped/licensed text
      purpose: general knowledge
    - component: third-party partnerships
      percent: undisclosed
      source_type: licensed datasets
      purpose: coverage / quality
    - component: human + synthetic feedback
      percent: undisclosed
      source_type: trainers / users / model-generated
      purpose: alignment and reasoning
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: GPT-5.6 flagship tier (Sol); see OpenAI system card for safety evals
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

# Model Facts — GPT-5.6 Sol

| | |
|---|---|
| **Developer** | OpenAI |
| **Status** | active |
| **License** | Proprietary (API) |
| **Released** | 2026-07-09 |

## Architecture

| | |
|---|---|
| Type | undisclosed (transformer-family) |
| Parameters | undisclosed |
| Context window | 1.05M |
| Quantization | n/a (API-served) |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | 2026-02-16 |
| Methodology | pre-training on public web + partner + user/trainer data → filtering → RL for reasoning chains (per GPT-5.6 system card) |
| Tokens | undisclosed |

| Component | % | Source | Purpose |
|---|---|---|---|
| public internet | undisclosed | scraped/licensed text | general knowledge |
| third-party partnerships | undisclosed | licensed datasets | coverage / quality |
| human + synthetic feedback | undisclosed | trainers / users / model-generated | alignment and reasoning |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | enabled |
| Audio (input) | disabled |
| Tool use | native |

*GPT-5.6 flagship tier (Sol); see OpenAI system card for safety evals*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | censored |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
