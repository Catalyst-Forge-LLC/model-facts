---
model_facts_version: 0.1.0
name: gemma-3-27b-it
developer: Google
status: active
license: Gemma Terms of Use
release_date: 2025-03-01
weights: https://huggingface.co/google/gemma-3-27b-it
base_model: google/gemma-3-27b-pt
architecture:
  type: dense transformer (decoder-only)
  parameters: 27.4B
  context_window: undisclosed
  quantization: bf16
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → RLHF
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: Multimodal Gemma 3 instruct variant
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

# Model Facts — gemma-3-27b-it

| | |
|---|---|
| **Developer** | Google |
| **Status** | active |
| **License** | Gemma Terms of Use |
| **Released** | 2025-03-01 |
| **Base model** | google/gemma-3-27b-pt |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 27.4B |
| Context window | undisclosed |
| Quantization | bf16 |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → RLHF |
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

*Multimodal Gemma 3 instruct variant*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
