---
model_facts_version: 0.1.0
status: active
name: Gemini 3.1 Pro
developer: Google DeepMind
license: Proprietary (API)
homepage: https://ai.google.dev/gemini-api/docs/generate-content/gemini-3
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
  knowledge_cutoff: 2025-01
  methodology: undisclosed (Gemini 3 family; see DeepMind model cards for safety evals)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: enabled
  tool_use: native
  notes: Pro-tier Gemini 3.x; Google docs list Jan 2025 knowledge cutoff — use Search Grounding for newer facts
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

# Model Facts — Gemini 3.1 Pro

| | |
|---|---|
| **Developer** | Google DeepMind |
| **Status** | active |
| **License** | Proprietary (API) |

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
| Knowledge cutoff | 2025-01 |
| Methodology | undisclosed (Gemini 3 family; see DeepMind model cards for safety evals) |
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

*Pro-tier Gemini 3.x; Google docs list Jan 2025 knowledge cutoff — use Search Grounding for newer facts*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | censored |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
