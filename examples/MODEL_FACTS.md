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
  reasoning_math: high   # assessment: Meta GSM8K 95.1, 8-shot CoT em_maj1@1, Llama-3.1-70B-Instruct
  coding: high           # assessment: Meta HumanEval 80.5, 0-shot pass@1, Llama-3.1-70B-Instruct
  vision_input: disabled
  audio_input: disabled
  tool_use: native
  languages: 8 languages officially supported
  notes: >-
    reasoning_math and coding are assessments grounded in Meta's publisher-reported
    Instruct scores (GSM8K, HumanEval), not a ModelFacts protocol.
    Quantized or locally modified copies need their own measurements.
safety:
  refusal_sensitivity: unresolved  # Meta publishes no refusal protocol or score
  instruction_following: high  # assessment: Meta IFEval 87.5, Llama-3.1-70B-Instruct
  filter_type: hybrid          # assessment: aligned instruct model, not a measured filter grade
benchmarks:
  - name: MMLU
    score: 83.6
    notes: Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 5-shot macro_avg/acc, publisher-reported
  - name: GSM8K
    score: 95.1
    notes: Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 8-shot CoT em_maj1@1, publisher-reported
  - name: HumanEval
    score: 80.5
    notes: Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 0-shot pass@1, publisher-reported
  - name: IFEval
    score: 87.5
    notes: Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, publisher-reported
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
| Reasoning / math | high (assessment) |
| Coding | high (assessment) |
| Vision (input) | disabled |
| Audio (input) | disabled |
| Tool use | native |

*8 languages officially supported. reasoning_math and coding are assessments grounded in Meta's publisher-reported Instruct scores (GSM8K, HumanEval), not a ModelFacts protocol. Quantized or locally modified copies need their own measurements.*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | unresolved |
| Instruction following | high (assessment) |
| Filter type | hybrid (assessment) |

*Safety levels are assessments, not a ModelFacts protocol. refusal_sensitivity is unresolved because Meta publishes no refusal protocol or score. instruction_following follows Meta IFEval 87.5 for Llama-3.1-70B-Instruct.*

## Benchmarks

Publisher-reported by Meta for **Llama-3.1-70B-Instruct** (bf16), from the [Llama 3.1 model card](https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct) and [eval details](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/eval_details.md). These figures do not transfer automatically to quantized or locally modified copies.

| Benchmark | Score | Notes |
|---|---|---|
| MMLU | 83.6 | Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 5-shot macro_avg/acc, publisher-reported |
| GSM8K | 95.1 | Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 8-shot CoT em_maj1@1, publisher-reported |
| HumanEval | 80.5 | Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, 0-shot pass@1, publisher-reported |
| IFEval | 87.5 | Meta Llama 3.1 model card, Llama-3.1-70B-Instruct, publisher-reported |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by [Catalyst Forge](https://www.catalystforge.com/)*
