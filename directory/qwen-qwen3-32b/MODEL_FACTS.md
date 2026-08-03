---
model_facts_version: 0.1.0
name: Qwen3-32B
developer: Alibaba (Qwen)
status: active
license: Apache-2.0
release_date: 2025-04-27
weights: https://huggingface.co/Qwen/Qwen3-32B
architecture:
  type: dense transformer (decoder-only)
  parameters: 32.8B
  context_window: 40k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT → RL (thinking / non-thinking modes)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  notes: Supports explicit thinking mode for harder reasoning
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

# Model Facts — Qwen3-32B

| | |
|---|---|
| **Developer** | Alibaba (Qwen) |
| **Status** | active |
| **License** | Apache-2.0 |
| **Released** | 2025-04-27 |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 32.8B |
| Context window | 40k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT → RL (thinking / non-thinking modes) |
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

*Supports explicit thinking mode for harder reasoning*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
