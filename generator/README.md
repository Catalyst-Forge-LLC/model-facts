# ModelFacts generator

Drafts a `MODEL_FACTS.md` from a model source. Deterministic facts come straight from
metadata. Judgment fields (capability levels, safety profile, training provenance) are
optionally drafted by an LLM that reads the model card.

That optional pass is an **intended constraint**, not a guarantee. The prompt tells the
model to stay inside the card and the schema enums. Constrained prompting and schema
validation cannot prove the draft is true. Review every judgment field and every score
before you publish. A valid file is well-formed. It is not automatically accurate.

## Sources

| Target | Where the facts come from |
|---|---|
| `org/name`, `hf:org/name`, or a full `huggingface.co` URL | HF model API (author, license, exact parameter count, release date, base model), `config.json` (context window, dtype, MoE), and the model card README |
| `ollama:name[:tag]` | Local Ollama `/api/show`: GGUF header facts (parameter count, context length, quantization level, license, base-model lineage) and capability flags (vision, audio, tools) |

More sources (OpenRouter, LM Studio, raw GGUF files) are planned. Adapters live in
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

Output is always **checked against the canonical schema before writing**. The
generator will refuse to emit an invalid file. Schema validity is not a truth check.

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

1. **Scan.** The source adapter pulls deterministic facts from structured metadata,
   not from prose. Exact parameter counts beat marketing numbers.
2. **Deterministic draft (default).** Omit `--model`. Required judgment enums get
   conservative defaults (`medium`, `hybrid`) and `# TODO: verify` comments, because
   v0.1.0 cannot leave those fields empty. Training facts that the metadata does not
   state stay `undisclosed`. Benchmarks are omitted until a source supplies them.
3. **Curate (optional).** The model card text plus extracted facts go to the chosen LLM
   with [`prompt.md`](./prompt.md). The intended constraint is card-stated facts only,
   `undisclosed` otherwise. The LLM's answer is sanitized (enum whitelist, deterministic
   architecture facts cannot be overridden). Sanitize-and-validate does not prove the
   content is true. A human still has to check scores and assessments against the card.
4. **Validate + render.** Frontmatter is checked against
   [`model-facts.schema.json`](../site/schema/model-facts.schema.json), then the
   nutrition-label body is rendered from it.
