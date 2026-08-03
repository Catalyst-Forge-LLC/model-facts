---
model_facts_version: 0.1.0
name: phi-4
developer: Microsoft
status: active
license: MIT
release_date: 2024-12-11
weights: https://huggingface.co/microsoft/phi-4
architecture:
  type: dense transformer (decoder-only)
  parameters: 14.7B
  context_window: 16k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → DPO (synthetic + organic data mix)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: prompted
  notes: Small model tuned for reasoning density
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

# Model Facts — phi-4

| | |
|---|---|
| **Developer** | Microsoft |
| **Status** | active |
| **License** | MIT |
| **Released** | 2024-12-11 |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 14.7B |
| Context window | 16k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → DPO (synthetic + organic data mix) |
| Tokens | undisclosed |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | prompted |

*Small model tuned for reasoning density*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
