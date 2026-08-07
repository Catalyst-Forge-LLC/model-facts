# Project Notes — ModelFacts

> Working notes for maintainers/agents picking up this project. Not published to the site.
> Last updated: 2026-08-07 (directory refresh from Ollama traction + current closed flagships).

## What this is

ModelFacts (modelfacts.dev) is a "Nutrition Facts" label for AI models — the sibling
standard to [AppFacts](https://appfacts.dev) (`app-facts`, same org, same
design language). AppFacts labels the **body** of software; ModelFacts labels the
**brain**. Tagline: *"Know the weights behind the words."*

## State as of 2026-07-31

Everything below is built, tested, and committed on `main`. Remote is
`git@github.com:Catalyst-Forge-LLC/model-facts.git` (repo exists, empty — **not yet
pushed**; owner pushes).

| Piece | Where | Status |
|---|---|---|
| Formal spec v0.1.0 | `SPEC.md` | Done. Five fact groups: architecture, training, capabilities, safety, benchmarks. Closed enums for judgment fields; `undisclosed` convention. File format version `"0.1.0"`. |
| Original concept draft | `SPEC-draft.md` | Preserved verbatim; SPEC.md formalizes it. |
| Canonical JSON Schema | `site/schema/model-facts.schema.json` | Done (draft-07). `$id` = modelfacts.dev URL. |
| Examples | `examples/MODEL_FACTS.md` (Llama-3.1-70B worked example), `examples/MODEL_FACTS.template.md` | Both pass validation. |
| Validator CLI | `validator/` | TypeScript ESM, pnpm, tsx + ajv + yaml. `pnpm validate <files…>`, CI-friendly exit codes. |
| Generator CLI | `generator/` | TypeScript ESM. Sources: Hugging Face (`org/name`, `hf:`, full URL) and local Ollama (`ollama:name[:tag]`). Optional LLM curation via ollama/openai/anthropic/xai/gemini (fetch-based, no SDK deps). Output self-validates against the schema before writing. |
| Site | `site/` | Static, Cloudflare Pages-ready (root = `site`, no build). AppFacts design system with violet accent (`--accent: #7c5cf0`). Landing + `/directory/` catalog. No `/v` viewer or badge pages yet. |
| Directory spec | `DIRECTORY_SPEC.md` | Done. Repo-canonical labels, static mirror, `draft`/`reviewed` curation, open+closed seed. |
| Directory seed | `directory/` + `directory-tools/` | 24 models (16 Ollama ≥250K/6mo + 8 closed flagships). Seed authored in `seed-catalog.ts`. `pnpm apply-reviews` + `pnpm sync`. |

Verified end-to-end on this machine: `Qwen/Qwen2.5-7B-Instruct` deterministic draft;
same model LLM-curated by local `gemma4:12b` (correctly kept `undisclosed` for Qwen's
unpublished training mix, pulled languages/benchmarks from the card); `ollama:gemma4:12b`
from GGUF header facts. All outputs pass the validator.

## Key design decisions (and why)

- **Frontmatter is the sole source of truth; the Markdown body is a rendered view** —
  identical to AppFacts. Body may drift; tooling doesn't verify body-vs-frontmatter.
- **The Golden Rule:** objective facts only. Subjective claims stay in READMEs.
- **`undisclosed` over omission** for facts a developer knowingly withholds (params,
  tokens, data mix). Making non-disclosure visible and comparable is the label's teeth.
- **Closed enums for judgment fields** (`reasoning_math: high|medium|low`,
  `filter_type: raw|censored|hybrid`, …) so files are comparable across models.
- **Generator: deterministic first, LLM second.** Hard facts (exact safetensors param
  count, context window from `config.json`, GGUF header data) never come from prose. The
  LLM only fills judgment/provenance fields from the card, and its output is sanitized —
  enum whitelists, architecture facts cannot be overridden. Without `--model`, drafts get
  conservative defaults marked `# TODO: verify`.
- **One `MODEL_FACTS.md` per model version**; a quantized re-release is a new file.
- **Licensing:** spec & schema CC0, tooling MIT — mirrors AppFacts.
- User conventions in this workspace: **pnpm + TypeScript + ESM only** for Node code;
  commit after substantive work, **never push without explicit ask**.

## Strategy review (honest take, from the build session)

**Strong parts**

- The framing is the asset: instantly explainable, and owning both sides (AppFacts +
  ModelFacts, matching design) is an ecosystem story one-off standards don't have.
- Timing: the primary *reader* of structured metadata is increasingly an AI agent
  choosing/configuring a model. Agents can't reliably parse a 4,000-word model card.
- The **safety section is the most differentiated piece** — "how hot are the built-in
  filters, do I need my own guardrails" is a real developer question no existing format
  answers crisply.
- The `undisclosed` convention is quietly the best idea in the spec.

**Headwinds**

- More crowded than AppFacts' niche: Hugging Face already has model-card YAML metadata
  (it's literally what our generator reads), Google's Model Cards paper spawned many
  templates, and "AI nutrition labels" has been tried (Twilio AI Nutrition Facts, Data
  Nutrition Project). None won — the niche is open, but open because adoption is hard.
- The most valuable fields are **self-reported judgment calls**. `refusal_sensitivity:
  medium` only means something if measured consistently. "ModelFacts Certified"
  eventually needs a benchmark harness behind it or it's trust-washing.
- Model churn: labels rot in months. The generator matters more than the spec.

**Verdict:** as a standards-body play competing with HF — low odds. As a buzz +
credibility play for Catalyst Forge with a cheap path to real utility — good odds; the
upside (HN, positioning, inbound) doesn't require the standard to "win."

**The move that changes the odds:** run the generator across the top 100–200 open models
and **ship the directory at launch**. Then modelfacts.dev is a useful comparison site on
day one instead of a proposal asking for adoption; the directory is the SEO surface;
every label carries the badge. Standards get adopted because a tool people already use
emits them — the AppFacts generator insight, doubled here.

## Next steps (rough priority)

1. **Push to GitHub** (owner does this; first push sets default branch — site links
   assume `main`). Directory seed is ready to ship with it.
2. Deploy site to Cloudflare Pages (project root = `site`, no build step) + DNS for
   modelfacts.dev — `/directory/` is the launch surface.
3. Expand the catalog (more open models; keep closed entries honest with `undisclosed`).
4. More generator sources: OpenRouter, LM Studio, raw GGUF files (adapters in
   `generator/src/sources/`, return the common `SourceFacts` shape).
5. Portable visual label + badge, mirroring AppFacts (`/v#mf1.…` zlib+base64url payload,
   no backend — see app-facts `SPEC-af1.md` / `BADGE_SPEC.md` for the pattern to adapt).
6. Longer term: a measured-benchmark harness so capability/safety enums can be
   verified rather than self-reported ("certified" needs teeth).

## Gotchas / environment notes

- Local Ollama runs at `localhost:11434`; `gemma4:12b` is available and was used for
  curation testing (a 14k-char card takes ~4 min on this machine).
- Ollama `/api/show` reports richer `capabilities` (incl. `audio`) than `/api/tags` —
  the generator correctly reads `show`.
- HF `config.json` can be gated/absent (GGUF-only repos); the HF adapter degrades
  gracefully (`undisclosed`).
- tsconfig uses `moduleResolution: "Bundler"` because tsx/esbuild is the runner; ajv is
  imported as the **named** export (`import { Ajv } from "ajv"`) to keep `tsc --noEmit`
  clean.
- Local preview: serve from `site/` (`cd site && lite-server`). Use `/directory/` **with
  the trailing slash**. Default lite-server historyApiFallback rewrites bare `/directory`
  to the homepage — `site/bs-config.js` disables that middleware.
- Fonts are **self-hosted** under `site/fonts/` (not Google Fonts CDN). Remote font CSS
  was making local loads feel multi-second even though HTML/JSON are tiny.
