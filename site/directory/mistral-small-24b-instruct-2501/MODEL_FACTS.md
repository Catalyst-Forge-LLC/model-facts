---
model_facts_version: 0.1.0
name: Mistral-Small-24B-Instruct-2501
developer: Mistral AI
status: active
license: Apache-2.0
release_date: 2025-01-28
weights: https://huggingface.co/mistralai/Mistral-Small-24B-Instruct-2501
base_model: mistralai/Mistral-Small-24B-Base-2501
architecture:
  type: dense transformer (decoder-only)
  parameters: 23.6B
  context_window: 32k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → preference optimization
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
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

# Model Facts — Mistral-Small-24B-Instruct-2501

| | |
|---|---|
| **Developer** | Mistral AI |
| **Status** | active |
| **License** | Apache-2.0 |
| **Released** | 2025-01-28 |
| **Base model** | mistralai/Mistral-Small-24B-Base-2501 |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 23.6B |
| Context window | 32k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → preference optimization |
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
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
