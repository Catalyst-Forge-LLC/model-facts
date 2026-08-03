---
model_facts_version: 0.1.0
name: Llama-3.1-8B-Instruct
developer: Meta
status: active
license: Llama 3.1 Community License
release_date: 2024-07-18
weights: https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct
base_model: meta-llama/Meta-Llama-3.1-8B
architecture:
  type: dense transformer (decoder-only)
  parameters: 8B
  context_window: 128k
  quantization: bf16
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: 2023-12
  methodology: pre-training → SFT → RLHF (rejection sampling + DPO)
  tokens: 15T
capabilities:
  natural_language: full
  reasoning_math: medium
  coding: medium
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  languages: 8 languages officially supported
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
benchmarks:
  - name: MMLU
    score: 69.4
    notes: 5-shot
  - name: HumanEval
    score: 72.6
    notes: pass@1
---

# Model Facts — Llama-3.1-8B-Instruct

| | |
|---|---|
| **Developer** | Meta |
| **Status** | active |
| **License** | Llama 3.1 Community License |
| **Released** | 2024-07-18 |
| **Base model** | meta-llama/Meta-Llama-3.1-8B |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 8B |
| Context window | 128k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | 2023-12 |
| Methodology | pre-training → SFT → RLHF (rejection sampling + DPO) |
| Tokens | 15T |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | medium |
| Coding | medium |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | native |

*8 languages officially supported*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| MMLU | 69.4 | 5-shot |
| HumanEval | 72.6 | pass@1 |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
