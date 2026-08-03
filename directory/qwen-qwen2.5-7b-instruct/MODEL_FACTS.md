---
model_facts_version: 0.1.0
name: Qwen2.5-7B-Instruct
developer: Alibaba (Qwen)
status: active
license: Apache-2.0
release_date: 2024-09-16
weights: https://huggingface.co/Qwen/Qwen2.5-7B-Instruct
base_model: Qwen/Qwen2.5-7B
architecture:
  type: dense transformer (decoder-only)
  parameters: 7.62B
  context_window: 128k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → RLHF
  tokens: 18T
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  languages: 29+ languages
safety:
  refusal_sensitivity: medium
  instruction_following: high
  filter_type: hybrid
generated:
  date: 2026-08-03
  generator: directory seed — human-reviewed judgment fields
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Qwen2.5-7B-Instruct

| | |
|---|---|
| **Developer** | Alibaba (Qwen) |
| **Status** | active |
| **License** | Apache-2.0 |
| **Released** | 2024-09-16 |
| **Base model** | Qwen/Qwen2.5-7B |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 7.62B |
| Context window | 128k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → RLHF |
| Tokens | 18T |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | native |

*29+ languages*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
