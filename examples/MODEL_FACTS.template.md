---
model_facts_version: "0.1.0"
name: Your-Model-7B-Instruct
developer: Your Org
status: active
license: Apache-2.0
# release_date: 2026-01-01
# homepage: https://example.com
# repository: https://github.com/org/model
# weights: https://huggingface.co/org/model
# base_model: Mistral-7B-v0.3        # for fine-tunes
architecture:
  type: dense transformer (decoder-only)
  parameters: 7B
  context_window: 32k
  quantization: bf16
  # active_parameters: ...           # MoE only
  # modalities_in: [text]
  # modalities_out: [text]
training:
  knowledge_cutoff: undisclosed
  methodology: pre-training → SFT
  # tokens: undisclosed
  # data_composition:
  #   - component: general web
  #     percent: undisclosed
  #     source_type: scraped/licensed text
  #     purpose: general knowledge
capabilities:
  natural_language: full
  reasoning_math: medium
  coding: medium
  vision_input: disabled
  audio_input: disabled
  # tool_use: prompted
  # languages: English only
  # notes: one line of objective nuance
safety:
  refusal_sensitivity: medium
  instruction_following: medium
  filter_type: hybrid
  # hallucination_benchmark:
  #   name: TruthfulQA
  #   score: 0.50
# benchmarks:
#   - name: MMLU
#     score: 62.0
#     notes: 5-shot
generated:
  date: 2026-07-31
  generator: hand-authored
# credits:
#   generated_with: https://modelfacts.dev
#   built_by: "Your Name — https://example.com"
---

# Model Facts — Your-Model-7B-Instruct

| | |
|---|---|
| **Developer** | Your Org |
| **Status** | active |
| **License** | Apache-2.0 |

## Architecture

| | |
|---|---|
| Type | dense transformer (decoder-only) |
| Parameters | 7B |
| Context window | 32k |
| Quantization | bf16 |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | undisclosed |
| Methodology | pre-training → SFT |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | medium |
| Coding | medium |
| Vision (input) | disabled |
| Audio (input) | disabled |

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | medium |
| Instruction following | medium |
| Filter type | hybrid |

---
*Generated with [ModelFacts](https://modelfacts.dev)*
