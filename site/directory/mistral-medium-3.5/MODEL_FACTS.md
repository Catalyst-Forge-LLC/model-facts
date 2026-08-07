---
model_facts_version: 0.1.0
status: active
name: Mistral-Medium-3.5
developer: Mistral AI
license: Modified MIT
homepage: https://ollama.com/library/mistral-medium-3.5
weights: https://huggingface.co/mistralai/Mistral-Medium-3.5-128B
architecture:
  type: dense transformer (decoder-only)
  parameters: 128B
  context_window: 256k
  quantization: bf16 / GGUF
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (unified instruct + reasoning + coding weights)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  languages: dozens of languages including EN/FR/ES/DE/IT/PT/NL/ZH/JA/KO/AR
  notes: Configurable reasoning effort; replaces Medium 3.1 / Magistral / Devstral 2 in products
safety:
  refusal_sensitivity: medium
  instruction_following: high
  filter_type: hybrid
benchmarks:
  - name: SWE-Bench Verified
    score: 77.6
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Mistral-Medium-3.5

| | |
|---|---|
| **Developer** | Mistral AI |
| **Status** | active |
| **License** | Modified MIT |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 128B |
| Context window | 256k |
| Quantization | bf16 / GGUF |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (unified instruct + reasoning + coding weights) |
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

*dozens of languages including EN/FR/ES/DE/IT/PT/NL/ZH/JA/KO/AR Configurable reasoning effort; replaces Medium 3.1 / Magistral / Devstral 2 in products*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| SWE-Bench Verified | 77.6 |  |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
