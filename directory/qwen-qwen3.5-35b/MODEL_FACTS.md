---
model_facts_version: 0.1.0
status: active
name: Qwen3.5-35B
developer: Alibaba (Qwen)
license: Apache-2.0
homepage: https://ollama.com/library/qwen3.5
weights: https://ollama.com/library/qwen3.5
architecture:
  type: dense transformer (decoder-only)
  parameters: 35B
  context_window: 256k
  quantization: GGUF (Ollama default)
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (Qwen3.5 multimodal family)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: Representative mid-size from Qwen3.5 family (0.8B–122B on Ollama)
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

# Model Facts — Qwen3.5-35B

| | |
|---|---|
| **Developer** | Alibaba (Qwen) |
| **Status** | active |
| **License** | Apache-2.0 |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 35B |
| Context window | 256k |
| Quantization | GGUF (Ollama default) |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (Qwen3.5 multimodal family) |
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

*Representative mid-size from Qwen3.5 family (0.8B–122B on Ollama)*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
