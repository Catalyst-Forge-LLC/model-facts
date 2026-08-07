---
model_facts_version: 0.1.0
status: active
name: Claude Opus 5
developer: Anthropic
license: Proprietary (API)
release_date: 2026-07-24
homepage: https://www.anthropic.com/news/claude-opus-5
architecture:
  type: undisclosed (decoder-only LLM)
  parameters: undisclosed
  context_window: 1M
  quantization: n/a (API-served)
  modalities_in:
    - text
    - image
  modalities_out:
    - text
training:
  knowledge_cutoff: 2026-05
  methodology: pre-training on proprietary mix of public web, private datasets, and synthetic data → Constitutional AI post-training (Opus 5 system card)
  tokens: undisclosed
  data_composition:
    - component: general web
      percent: undisclosed
      source_type: ClaudeBot crawl of public sites
      purpose: general knowledge
    - component: public and private datasets
      percent: undisclosed
      source_type: licensed / curated corpora
      purpose: coverage and quality
    - component: synthetic
      percent: undisclosed
      source_type: model-generated
      purpose: capability and alignment data
capabilities:
  natural_language: full
  reasoning_math: high
  coding: high
  vision_input: enabled
  audio_input: disabled
  tool_use: native
  notes: Recommended default for complex agentic coding; adaptive thinking; max output 128k
safety:
  refusal_sensitivity: high
  instruction_following: high
  filter_type: censored
generated:
  date: 2026-08-07
  generator: directory seed — Ollama/API refresh 2026-08
credits:
  generated_with: https://modelfacts.dev
  built_by: Catalyst Forge — https://www.catalystforge.com/
---

# Model Facts — Claude Opus 5

| | |
|---|---|
| **Developer** | Anthropic |
| **Status** | active |
| **License** | Proprietary (API) |
| **Released** | 2026-07-24 |

## Architecture

| | |
|---|---|
| Type | undisclosed (decoder-only LLM) |
| Parameters | undisclosed |
| Context window | 1M |
| Quantization | n/a (API-served) |
| Modalities | text + image → text |

## Training Provenance

| | |
|---|---|
| Knowledge cutoff | 2026-05 |
| Methodology | pre-training on proprietary mix of public web, private datasets, and synthetic data → Constitutional AI post-training (Opus 5 system card) |
| Tokens | undisclosed |

| Component | % | Source | Purpose |
|---|---|---|---|
| general web | undisclosed | ClaudeBot crawl of public sites | general knowledge |
| public and private datasets | undisclosed | licensed / curated corpora | coverage and quality |
| synthetic | undisclosed | model-generated | capability and alignment data |

## Capabilities

| Capability | Level |
|---|---|
| Natural language | full |
| Reasoning / math | high |
| Coding | high |
| Vision (input) | enabled |
| Audio (input) | disabled |
| Tool use | native |

*Recommended default for complex agentic coding; adaptive thinking; max output 128k*

## Safety Profile

| | |
|---|---|
| Refusal sensitivity | high |
| Instruction following | high |
| Filter type | censored |

---
*Generated with [ModelFacts](https://modelfacts.dev) · Built by Catalyst Forge — https://www.catalystforge.com/*
