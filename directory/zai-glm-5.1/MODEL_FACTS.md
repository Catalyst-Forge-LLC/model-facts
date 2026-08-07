---
model_facts_version: 0.1.0
status: active
name: GLM-5.1
developer: Z.ai
license: MIT
homepage: https://ollama.com/library/glm-5.1
weights: https://ollama.com/library/glm-5.1
architecture:
  type: undisclosed (transformer-family)
  parameters: undisclosed
  context_window: 198k
  quantization: cloud / Ollama
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (agentic engineering post-training)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  notes: Long-horizon agentic coding flagship (pre-5.2)
safety:
  refusal_sensitivity: medium
  instruction_following: high
  filter_type: hybrid
benchmarks:
  - name: SWE-Bench Pro
    score: 58.4
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — GLM-5.1

| | |
|---|---|
| **Developer** | Z.ai |
| **Status** | active |
| **License** | MIT |

## Architecture

| | |
|---|---|
| Type | undisclosed (transformer-family) |
| Parameters | undisclosed |
| Context window | 198k |
| Quantization | cloud / Ollama |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (agentic engineering post-training) |
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

*Long-horizon agentic coding flagship (pre-5.2)*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| SWE-Bench Pro | 58.4 |  |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
