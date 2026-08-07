---
model_facts_version: 0.1.0
status: active
name: DeepSeek-V4-Pro
developer: DeepSeek
license: MIT
homepage: https://ollama.com/library/deepseek-v4-pro
weights: https://ollama.com/library/deepseek-v4-pro
architecture:
  type: mixture of experts (MoE)
  parameters: 1.6T
  active_parameters: 49B
  context_window: 1M
  quantization: bf16 / cloud (Ollama)
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (V4 flagship; no/thinking/max thinking modes)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  notes: Frontier V4 MoE — 1.6T total / 49B active
safety:
  refusal_sensitivity: low
  instruction_following: high
  filter_type: raw
benchmarks:
  - name: MMLU-Pro
    score: 87.5
    notes: V4-Pro Max
  - name: GPQA Diamond
    score: 90.1
    notes: V4-Pro Max
  - name: SWE Verified
    score: 80.6
    notes: V4-Pro Max
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — DeepSeek-V4-Pro

| | |
|---|---|
| **Developer** | DeepSeek |
| **Status** | active |
| **License** | MIT |

## Architecture

| | |
|---|---|
| Type | mixture of experts (MoE) |
| Parameters | 1.6T |
| Active parameters | 49B |
| Context window | 1M |
| Quantization | bf16 / cloud (Ollama) |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (V4 flagship; no/thinking/max thinking modes) |
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

*Frontier V4 MoE — 1.6T total / 49B active*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | low |
| Instruction following | high |
| Filter type | raw |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| MMLU-Pro | 87.5 | V4-Pro Max |
| GPQA Diamond | 90.1 | V4-Pro Max |
| SWE Verified | 80.6 | V4-Pro Max |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
