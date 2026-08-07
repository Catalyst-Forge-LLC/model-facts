---
model_facts_version: 0.1.0
status: active
name: Nemotron-3-Nano-Omni
developer: NVIDIA
license: NVIDIA Open Model License
homepage: https://ollama.com/library/nemotron3
weights: https://ollama.com/library/nemotron3
architecture:
  type: dense transformer (multimodal)
  parameters: 33B
  context_window: undisclosed
  quantization: GGUF (Ollama default)
  modalities_in:
    - text
    - image
    - audio
    - video
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (omni multimodal enterprise workflows)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: medium
  vision_input: enabled
  audio_input: enabled
  tool_use: native
  notes: Unified video/audio/image/text understanding
safety:
  refusal_sensitivity: medium
  instruction_following: high
  filter_type: hybrid
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Nemotron-3-Nano-Omni

| | |
|---|---|
| **Developer** | NVIDIA |
| **Status** | active |
| **License** | NVIDIA Open Model License |

## Architecture

| | |
|---|---|
| Type | dense transformer (multimodal) |
| Parameters | 33B |
| Context window | undisclosed |
| Quantization | GGUF (Ollama default) |
| Modalities | text + image + audio + video → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (omni multimodal enterprise workflows) |
| Tokens | undisclosed |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | medium |
| Vision (input) | enabled |
| Audio (input) | enabled |
| Tool use | native |

*Unified video/audio/image/text understanding*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
