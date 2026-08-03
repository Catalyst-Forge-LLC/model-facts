---
model_facts_version: 0.1.0
name: gemma-2-27b-it
developer: Google
status: active
license: Gemma Terms of Use
release_date: 2024-06-24
weights: https://huggingface.co/google/gemma-2-27b-it
base_model: google/gemma-2-27b
architecture:
  type: dense transformer (decoder-only)
  parameters: 27.2B
  context_window: 8k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → RLHF
  tokens: 13T
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: prompted
safety:
  refusal_sensitivity: high
  instruction_following: high
  filter_type: hybrid
generated:
  date: 2026-08-03
  generator: directory seed — human-reviewed judgment fields
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — gemma-2-27b-it

| | |
|---|---|
| **Developer** | Google |
| **Status** | active |
| **License** | Gemma Terms of Use |
| **Released** | 2024-06-24 |
| **Base model** | google/gemma-2-27b |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 27.2B |
| Context window | 8k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → RLHF |
| Tokens | 13T |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | prompted |

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
