---
model_facts_version: 0.1.0
status: active
name: Grok 4.5
developer: xAI
license: Proprietary (API)
homepage: https://x.ai/
architecture:
  type: undisclosed (transformer-family)
  parameters: undisclosed
  context_window: 500k
  quantization: n/a (API-served)
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (xAI has not published a detailed public system card comparable to Anthropic/OpenAI)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: Cheap-flagship tier; real-time X data claimed — training mix still unpublished
safety:
  refusal_sensitivity: low
  instruction_following: high
  filter_type: hybrid
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Grok 4.5

| | |
|---|---|
| **Developer** | xAI |
| **Status** | active |
| **License** | Proprietary (API) |

## Architecture

| | |
|---|---|
| Type | undisclosed (transformer-family) |
| Parameters | undisclosed |
| Context window | 500k |
| Quantization | n/a (API-served) |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (xAI has not published a detailed public system card comparable to Anthropic/OpenAI) |
| Tokens | undisclosed |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | enabled |
| Audio (input) | disabled |
| Tool use | native |

*Cheap-flagship tier; real-time X data claimed — training mix still unpublished*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | low |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
