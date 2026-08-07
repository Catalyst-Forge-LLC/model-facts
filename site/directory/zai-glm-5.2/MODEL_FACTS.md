---
model_facts_version: 0.1.0
status: active
name: GLM-5.2
developer: Z.ai
license: MIT
homepage: https://ollama.com/library/glm-5.2
weights: https://ollama.com/library/glm-5.2
architecture:
  type: undisclosed (transformer-family)
  parameters: undisclosed
  context_window: 1M
  quantization: cloud / Ollama
  modalities_in:
    - text
  modalities_out:
    - text
training:
  knowledge_cutoff: undisclosed
  methodology: undisclosed (long-horizon coding-agent post-training)
  tokens: undisclosed
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  notes: 1M usable context; High/Max thinking effort levels
safety:
  refusal_sensitivity: medium
  instruction_following: high
  filter_type: hybrid
benchmarks:
  - name: Terminal-Bench 2.1
    score: 81
  - name: SWE-bench Pro
    score: 62.1
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — GLM-5.2

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
| Context window | 1M |
| Quantization | cloud / Ollama |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | undisclosed (long-horizon coding-agent post-training) |
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

*1M usable context; High/Max thinking effort levels*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| Terminal-Bench 2.1 | 81 |  |
| SWE-bench Pro | 62.1 |  |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
