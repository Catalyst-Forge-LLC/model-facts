---
model_facts_version: "0.1.0"
name: Llama-3.1-70B-Instruct
developer: Meta
status: active
license: Llama 3.1 Community License
release_date: 2024-07-23
homepage: https://ai.meta.com/blog/meta-llama-3-1/
weights: https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct
architecture:
  type: dense transformer (decoder-only)
  parameters: 70B
  context_window: 128k
  quantization: bf16
  modalities_in: [text]
  modalities_out: [text]
training:
  knowledge_cutoff: 2023-12
  methodology: pre-training → SFT → RLHF (rejection sampling + DPO)
  tokens: 15T
  data_composition:
    - component: general web
      percent: undisclosed
      source_type: scraped/licensed text
      purpose: general knowledge and nuance
    - component: code
      percent: undisclosed
      source_type: public repositories
      purpose: logic, syntax, and translation
    - component: synthetic
      percent: undisclosed
      source_type: LLM-generated chains
      purpose: chain-of-thought and refinement
    - component: human feedback
      percent: undisclosed
      source_type: RLHF / DPO
      purpose: alignment to human intent
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  languages: 8 languages officially supported
  notes: strongest in Python, JavaScript, C++; multilingual tone matching
safety:
  refusal_sensitivity: medium
  instruction_following: high
  filter_type: hybrid
  hallucination_benchmark:
    name: TruthfulQA
    score: 0.60
benchmarks:
  - name: MMLU
    score: 83.6
    notes: 5-shot
  - name: GSM8K
    score: 95.1
    notes: 8-shot CoT
  - name: HumanEval
    score: 80.5
    notes: pass@1
generated:
  date: 2026-07-31
  generator: hand-authored
credits:
  generated_with: https://modelfacts.dev
  built_by: "Catalyst Forge — https://www.catalystforge.com/"
---

# Model Facts — Llama-3.1-70B-Instruct

| | |
|---|---|
| **Developer** | Meta |
| **Status** | active |
| **License** | Llama 3.1 Community License |
| **Released** | 2024-07-23 |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 70B |
| Context window | 128k |
| Quantization | bf16 |
| Modalities | text → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | 2023-12 |
| Methodology | pre-training → SFT → RLHF (rejection sampling + DPO) |
| Tokens | 15T |

| Component | % | Source | Purpose |
|---|---|---|---|
| general web | undisclosed | scraped/licensed text | general knowledge and nuance |
| code | undisclosed | public repositories | logic, syntax, and translation |
| synthetic | undisclosed | LLM-generated chains | chain-of-thought and refinement |
| human feedback | undisclosed | RLHF / DPO | alignment to human intent |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | native |

*8 languages officially supported. Strongest in Python, JavaScript, C++; multilingual tone matching.*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | high |
| Filter type | hybrid |
| Hallucination | TruthfulQA 0.60 |

## Benchmarks

| Benchmark | Score | Notes |
|---|---|---|
| MMLU | 83.6 | 5-shot |
| GSM8K | 95.1 | 8-shot CoT |
| HumanEval | 80.5 | pass@1 |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by [Catalyst Forge](https://www.catalystforge.com/)*
