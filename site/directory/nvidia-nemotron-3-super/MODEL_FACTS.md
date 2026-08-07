---
model_facts_version: 0.1.0
status: active
name: Nemotron-3-Super
developer: NVIDIA
license: NVIDIA Open Model License
homepage: https://ollama.com/library/nemotron-3-super
weights: https://ollama.com/library/nemotron-3-super
architecture:
  type: mixture of experts (MoE)
  parameters: 120B
  active_parameters: 12B
  context_window: undisclosed
  quantization: GGUF / cloud (Ollama)
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (multi-agent / high-throughput reasoning)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  notes: 120B MoE activating ~12B per token
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

# Model Facts — Nemotron-3-Super

| | |
|---|---|
| **Developer** | NVIDIA |
| **Status** | active |
| **License** | NVIDIA Open Model License |

## Architecture

| | |
|---|---|
| Type | mixture of experts (MoE) |
| Parameters | 120B |
| Active parameters | 12B |
| Context window | undisclosed |
| Quantization | GGUF / cloud (Ollama) |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (multi-agent / high-throughput reasoning) |
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

*120B MoE activating ~12B per token*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
