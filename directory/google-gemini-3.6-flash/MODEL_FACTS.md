---
model_facts_version: 0.1.0
status: active
name: Gemini 3.6 Flash
developer: Google DeepMind
license: Proprietary (API)
release_date: 2026-07-21
homepage: https://deepmind.google/models/model-cards/gemini-3-6-flash/
architecture:
  type: undisclosed (transformer-family)
  parameters: undisclosed
  context_window: 1M
  quantization: n/a (API-served)
  modalities_in:
    - text
    - image
    - audio
    - video
  modalities_out:
    - text
training:
  knowledge_cutoff: 2026-03
  methodology: undisclosed (Gemini 3.6 Flash model card; some domains may still reflect Jan 2025)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: enabled
  tool_use: native
  notes: Flash workhorse; model card knowledge cutoff March 2026 with domain caveats
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

# Model Facts — Gemini 3.6 Flash

| | |
|---|---|
| **Developer** | Google DeepMind |
| **Status** | active |
| **License** | Proprietary (API) |
| **Released** | 2026-07-21 |

## Architecture

| | |
|---|---|
| Type | undisclosed (transformer-family) |
| Parameters | undisclosed |
| Context window | 1M |
| Quantization | n/a (API-served) |
| Modalities | text + image + audio + video → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | 2026-03 |
| Methodology | undisclosed (Gemini 3.6 Flash model card; some domains may still reflect Jan 2025) |
| Tokens | undisclosed |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | enabled |
| Audio (input) | enabled |
| Tool use | native |

*Flash workhorse; model card knowledge cutoff March 2026 with domain caveats*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | censored |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
