---
model_facts_version: 0.1.0
name: DeepSeek-V3
developer: DeepSeek
status: active
license: MIT
release_date: 2024-12-25
weights: https://huggingface.co/deepseek-ai/DeepSeek-V3
architecture:
  type: mixture of experts (MoE)
  parameters: 671B
  context_window: 128k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
  active_parameters: 37B
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → RL
  tokens: 14.8T
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

# Model Facts — DeepSeek-V3

| | |
|---|---|
| **Developer** | DeepSeek |
| **Status** | active |
| **License** | MIT |
| **Released** | 2024-12-25 |

## Architecture

| | |
|---|---|
| Type | mixture of experts (MoE) |
| Parameters | 671B |
| Active parameters | 37B |
| Context window | 128k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → RL |
| Tokens | 14.8T |

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
