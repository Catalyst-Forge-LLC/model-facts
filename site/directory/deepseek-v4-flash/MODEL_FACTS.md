---
model_facts_version: 0.1.0
status: active
name: DeepSeek-V4-Flash
developer: DeepSeek
license: MIT
homepage: https://ollama.com/library/deepseek-v4-flash
weights: https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash
architecture:
  type: mixture of experts (MoE)
  parameters: 284B
  active_parameters: 13B
  context_window: 1M
  quantization: bf16 / cloud (Ollama)
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (V4 series; no/thinking/max thinking modes)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  notes: Efficient 1M-context MoE preview of DeepSeek-V4
safety:
  refusal_sensitivity: low
  instruction_following: high
  filter_type: raw
benchmarks:
  - name: MMLU-Pro
    score: 86.4
    notes: V4-Flash High
  - name: GPQA Diamond
    score: 87.4
    notes: V4-Flash High
  - name: SWE Verified
    score: 78.6
    notes: V4-Flash High
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — DeepSeek-V4-Flash

| | |
|---|---|
| **Developer** | DeepSeek |
| **Status** | active |
| **License** | MIT |

## Architecture

| | |
|---|---|
| Type | mixture of experts (MoE) |
| Parameters | 284B |
| Active parameters | 13B |
| Context window | 1M |
| Quantization | bf16 / cloud (Ollama) |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (V4 series; no/thinking/max thinking modes) |
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

*Efficient 1M-context MoE preview of DeepSeek-V4*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | low |
| Instruction following | high |
| Filter type | raw |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| MMLU-Pro | 86.4 | V4-Flash High |
| GPQA Diamond | 87.4 | V4-Flash High |
| SWE Verified | 78.6 | V4-Flash High |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
