---
model_facts_version: 0.1.0
name: granite-3.1-8b-instruct
developer: IBM
status: active
license: Apache-2.0
release_date: 2024-12-06
weights: https://huggingface.co/ibm-granite/granite-3.1-8b-instruct
base_model: ibm-granite/granite-3.1-8b-base
architecture:
  type: dense transformer (decoder-only)
  parameters: 8.17B
  context_window: 128k
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
  reasoning_math: medium
  coding: medium
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

# Model Facts — granite-3.1-8b-instruct

| | |
|---|---|
| **Developer** | IBM |
| **Status** | active |
| **License** | Apache-2.0 |
| **Released** | 2024-12-06 |
| **Base model** | ibm-granite/granite-3.1-8b-base |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 8.17B |
| Context window | 128k |
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
| Reasoning / math | medium |
| Coding | medium |
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
