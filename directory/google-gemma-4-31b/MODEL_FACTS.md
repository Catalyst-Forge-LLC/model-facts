---
model_facts_version: 0.1.0
status: active
name: Gemma-4-31B
developer: Google DeepMind
license: Gemma Terms of Use
homepage: https://ollama.com/library/gemma4
weights: https://ollama.com/library/gemma4
architecture:
  type: dense transformer (decoder-only)
  parameters: 31B
  context_window: 256k
  quantization: GGUF (Ollama default)
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (Gemma 4 instruct + thinking modes)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: Representative dense 31B from Gemma 4 family (also E2B/E4B/12B/26B-MoE)
safety:
  refusal_sensitivity: high
  instruction_following: high
  filter_type: hybrid
benchmarks:
  - name: MMLU Pro
    score: 85.2
  - name: GPQA Diamond
    score: 84.3
  - name: LiveCodeBench v6
    score: 80
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Gemma-4-31B

| | |
|---|---|
| **Developer** | Google DeepMind |
| **Status** | active |
| **License** | Gemma Terms of Use |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 31B |
| Context window | 256k |
| Quantization | GGUF (Ollama default) |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (Gemma 4 instruct + thinking modes) |
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

*Representative dense 31B from Gemma 4 family (also E2B/E4B/12B/26B-MoE)*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | hybrid |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| MMLU Pro | 85.2 |  |
| GPQA Diamond | 84.3 |  |
| LiveCodeBench v6 | 80 |  |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
