---
model_facts_version: 0.1.0
name: Mixtral-8x22B-Instruct-v0.1
developer: Mistral AI
status: active
license: Apache-2.0
release_date: 2024-04-16
weights: https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1
base_model: mistralai/Mixtral-8x22B-v0.1
architecture:
  type: mixture of experts (MoE)
  parameters: 8x22B
  context_window: 64k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
  active_parameters: 39B
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
safety:
  refusal_sensitivity: low
  instruction_following: high
  filter_type: raw
generated:
  date: 2026-08-03
  generator: directory seed — human-reviewed judgment fields
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Mixtral-8x22B-Instruct-v0.1

| | |
|---|---|
| **Developer** | Mistral AI |
| **Status** | active |
| **License** | Apache-2.0 |
| **Released** | 2024-04-16 |
| **Base model** | mistralai/Mixtral-8x22B-v0.1 |

## Architecture

| | |
|---|---|
| Type | mixture of experts (MoE) |
| Parameters | 8x22B |
| Active parameters | 39B |
| Context window | 64k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT |
| Tokens | undisclosed |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | native |

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | low |
| Instruction following | high |
| Filter type | raw |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
