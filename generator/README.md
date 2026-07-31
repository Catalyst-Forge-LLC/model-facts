# ModelFacts generator

Drafts a `MODEL_FACTS.md` from a model source: deterministic facts come straight from
metadata; judgment fields (capability levels, safety profile, training provenance) are
optionally curated by an LLM reading the model card — never invented.

## Sources

| Target | Where the facts come from |
|---|---|
| `org/name`, `hf:org/name`, or a full `huggingface.co` URL | HF model API (author, license, exact parameter count, release date, base model), `config.json` (context window, dtype, MoE), and the model card README |
| `ollama:name[:tag]` | Local Ollama `/api/show`: GGUF header facts (parameter count, context length, quantization level, license, base-model lineage) and capability flags (vision, audio, tools) |

More sources (OpenRouter, LM Studio, raw GGUF files) are planned — adapters live in
[`src/sources/`](./src/sources/) and return one common `SourceFacts` shape.

## Usage

```bash
cd generator
pnpm install

# deterministic draft — no LLM, judgment fields marked "# TODO: verify"
pnpm generate Qwen/Qwen2.5-7B-Instruct --output MODEL_FACTS.md

# LLM-curated from the model card (local-first via Ollama)
pnpm generate Qwen/Qwen2.5-7B-Instruct --provider ollama --model llama3.1

# from a local Ollama model
pnpm generate ollama:llama3.1 --provider ollama --model llama3.1
```

Output is always **validated against the canonical schema before writing** — the
generator will refuse to emit an invalid file.

## Options

| Flag / arg | Default | Description |
|---|---|---|
| `TARGET` | *(required)* | `org/name`, `hf:…`, `https://huggingface.co/…`, or `ollama:name[:tag]` |
| `--provider` | `ollama` | One of `ollama`, `openai`, `anthropic`, `xai`, `gemini` |
| `--model` | — | LLM model for curation. **Omit to skip the LLM** (deterministic draft mode). |
| `--output` | `MODEL_FACTS.md` | Where to write |
| `--ollama-host` | `http://localhost:11434` | Used for both the `ollama:` source and the `ollama` provider |
| `--status` | `active` | `active`, `deprecated`, `preview`, `archived` |
| `--built-by` | — | Credit line for `credits.built_by` |
| `--dry-run` | off | Print instead of writing |

Hosted providers read one env var each: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
`XAI_API_KEY`, `GEMINI_API_KEY`.

## How it works

1. **Scan.** The source adapter pulls deterministic facts from structured metadata —
   never from prose. Exact parameter counts beat marketing numbers.
2. **Curate (optional).** The model card text plus extracted facts go to the chosen LLM
   with [`prompt.md`](./prompt.md), which enforces the Golden Rule: only card-stated
   facts, `undisclosed` otherwise. The LLM's answer is sanitized — enum values are
   whitelisted, deterministic architecture facts cannot be overridden.
3. **Validate + render.** Frontmatter is checked against
   [`model-facts.schema.json`](../site/schema/model-facts.schema.json), then the
   nutrition-label body is rendered from it.

Without `--model`, judgment fields get conservative defaults with `# TODO: verify`
comments so a human (or a later LLM pass) can finish the label honestly.
