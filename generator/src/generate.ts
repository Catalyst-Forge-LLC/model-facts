#!/usr/bin/env tsx
/**
 * Draft a MODEL_FACTS.md from a model source.
 *
 * Usage:
 *   pnpm generate <target> [flags]
 *
 * Targets:
 *   org/name                          Hugging Face model id
 *   hf:org/name                      Hugging Face model id (explicit)
 *   https://huggingface.co/org/name  Hugging Face URL
 *   ollama:name[:tag]                Local Ollama model
 *
 * Flags:
 *   --provider ollama|openai|anthropic|xai|gemini   LLM for curation (default: ollama)
 *   --model <name>       LLM model. Omit to skip LLM curation (deterministic draft).
 *   --output <path>      Output file (default: ./MODEL_FACTS.md)
 *   --ollama-host <url>  Default http://localhost:11434 (source and LLM)
 *   --status <enum>      active|deprecated|preview|archived (default: active)
 *   --built-by <text>    Credit line, e.g. "Catalyst Forge — https://catalystforge.com/"
 *   --dry-run            Print instead of writing
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { stringify as yamlStringify } from "yaml";
import { Benchmark, DataComposition, ModelFacts, SourceFacts } from "./facts.js";
import { chat, extractJson, LlmOptions, Provider } from "./llm.js";
import { renderBody } from "./render.js";
import { fromHuggingFace } from "./sources/hf.js";
import { fromOllama } from "./sources/ollama.js";

const here = dirname(fileURLToPath(import.meta.url));
const VERSION = "0.1.0";
const GENERATOR = `modelfacts-generator v${VERSION}`;

// ---------- args ----------

interface Args {
  target: string;
  provider: Provider;
  model?: string;
  output: string;
  ollamaHost: string;
  status: ModelFacts["status"];
  builtBy?: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    target: "",
    provider: "ollama",
    output: "MODEL_FACTS.md",
    ollamaHost: "http://localhost:11434",
    status: "active",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`${a} requires a value`);
      return argv[++i];
    };
    switch (a) {
      case "--provider": args.provider = next() as Provider; break;
      case "--model": args.model = next(); break;
      case "--output": args.output = next(); break;
      case "--ollama-host": args.ollamaHost = next(); break;
      case "--status": args.status = next() as ModelFacts["status"]; break;
      case "--built-by": args.builtBy = next(); break;
      case "--dry-run": args.dryRun = true; break;
      default:
        if (a.startsWith("--")) throw new Error(`Unknown flag: ${a}`);
        if (args.target) throw new Error(`Unexpected extra argument: ${a}`);
        args.target = a;
    }
  }
  if (!args.target) {
    console.error("Usage: pnpm generate <org/name | hf:… | https://huggingface.co/… | ollama:name> [flags]");
    process.exit(2);
  }
  return args;
}

// ---------- LLM patch sanitization ----------

const LEVELS = new Set(["high", "medium", "low"]);
const NL = new Set(["full", "limited"]);
const TOOL = new Set(["native", "prompted", "none"]);
const FILTER = new Set(["raw", "censored", "hybrid"]);

function asEnum<T extends string>(v: unknown, allowed: Set<string>): T | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().toLowerCase().replace(/^med$/, "medium");
  return allowed.has(s) ? (s as T) : undefined;
}

function asStr(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function asComposition(v: unknown): DataComposition[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const rows = v
    .map((r): DataComposition | null => {
      if (typeof r !== "object" || r === null) return null;
      const o = r as Record<string, unknown>;
      const component = asStr(o.component);
      const source_type = asStr(o.source_type);
      const purpose = asStr(o.purpose);
      const percent =
        typeof o.percent === "number" && o.percent >= 0 && o.percent <= 100
          ? o.percent
          : ("undisclosed" as const);
      return component && source_type && purpose ? { component, percent, source_type, purpose } : null;
    })
    .filter((r): r is DataComposition => r !== null)
    .slice(0, 8);
  return rows.length ? rows : undefined;
}

function asBenchmarks(v: unknown): Benchmark[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const rows = v
    .map((r): Benchmark | null => {
      if (typeof r !== "object" || r === null) return null;
      const o = r as Record<string, unknown>;
      const name = asStr(o.name);
      if (!name || typeof o.score !== "number") return null;
      const notes = asStr(o.notes);
      return notes ? { name, score: o.score, notes } : { name, score: o.score };
    })
    .filter((r): r is Benchmark => r !== null)
    .slice(0, 10);
  return rows.length ? rows : undefined;
}

function applyLlmPatch(facts: ModelFacts, patch: Record<string, unknown>): void {
  const t = (patch.training ?? {}) as Record<string, unknown>;
  facts.training.knowledge_cutoff = asStr(t.knowledge_cutoff) ?? facts.training.knowledge_cutoff;
  facts.training.methodology = asStr(t.methodology) ?? facts.training.methodology;
  facts.training.tokens = asStr(t.tokens) ?? facts.training.tokens;
  facts.training.data_composition = asComposition(t.data_composition) ?? facts.training.data_composition;

  const c = (patch.capabilities ?? {}) as Record<string, unknown>;
  facts.capabilities.natural_language = asEnum(c.natural_language, NL) ?? facts.capabilities.natural_language;
  facts.capabilities.reasoning_math = asEnum(c.reasoning_math, LEVELS) ?? facts.capabilities.reasoning_math;
  facts.capabilities.coding = asEnum(c.coding, LEVELS) ?? facts.capabilities.coding;
  // vision/audio stay deterministic (metadata beats card prose)
  facts.capabilities.tool_use = facts.capabilities.tool_use ?? asEnum(c.tool_use, TOOL);
  facts.capabilities.languages = asStr(c.languages) ?? facts.capabilities.languages;
  facts.capabilities.notes = asStr(c.notes) ?? facts.capabilities.notes;

  const s = (patch.safety ?? {}) as Record<string, unknown>;
  facts.safety.refusal_sensitivity = asEnum(s.refusal_sensitivity, LEVELS) ?? facts.safety.refusal_sensitivity;
  facts.safety.instruction_following = asEnum(s.instruction_following, LEVELS) ?? facts.safety.instruction_following;
  facts.safety.filter_type = asEnum(s.filter_type, FILTER) ?? facts.safety.filter_type;
  const hb = s.hallucination_benchmark as Record<string, unknown> | undefined;
  if (hb && asStr(hb.name) && typeof hb.score === "number") {
    facts.safety.hallucination_benchmark = { name: asStr(hb.name)!, score: hb.score };
  }

  facts.benchmarks = asBenchmarks(patch.benchmarks) ?? facts.benchmarks;
}

// ---------- assembly ----------

function assemble(src: SourceFacts, args: Args): ModelFacts {
  return {
    model_facts_version: "0.1.0",
    name: src.name,
    developer: src.developer ?? "undisclosed",
    status: args.status,
    license: src.license ?? "UNKNOWN",
    release_date: src.releaseDate,
    weights: src.weights,
    base_model: src.baseModel,
    architecture: {
      type: src.architectureType ?? "undisclosed",
      parameters: src.parameters ?? "undisclosed",
      active_parameters: src.activeParameters,
      context_window: src.contextWindow ?? "undisclosed",
      quantization: src.quantization ?? "undisclosed",
      modalities_in: ["text", ...(src.visionInput === "enabled" ? ["image"] : []), ...(src.audioInput === "enabled" ? ["audio"] : [])],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: src.visionInput ?? "disabled",
      audio_input: src.audioInput ?? "disabled",
      tool_use: src.toolUse,
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "medium",
      filter_type: "hybrid",
    },
    generated: { date: new Date().toISOString().slice(0, 10), generator: GENERATOR },
    credits: {
      generated_with: "https://modelfacts.dev",
      ...(args.builtBy ? { built_by: args.builtBy } : {}),
    },
  };
}

/** Remove undefined values so YAML output stays clean. */
function prune<T>(value: T): T {
  if (Array.isArray(value)) return value.map(prune) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== undefined) out[k] = prune(v);
    }
    return out as T;
  }
  return value;
}

/** In deterministic-draft mode, flag the judgment fields for human review. */
const REVIEW_KEYS = [
  "knowledge_cutoff",
  "methodology",
  "natural_language",
  "reasoning_math",
  "coding",
  "refusal_sensitivity",
  "instruction_following",
  "filter_type",
];

function addTodoComments(yamlText: string): string {
  const re = new RegExp(`^(\\s+(?:${REVIEW_KEYS.join("|")}): .+)$`, "gm");
  return yamlText.replace(re, "$1 # TODO: verify");
}

// ---------- main ----------

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  console.error(`Scanning ${args.target} …`);
  const src = args.target.startsWith("ollama:")
    ? await fromOllama(args.target, args.ollamaHost)
    : await fromHuggingFace(args.target);

  const facts = assemble(src, args);

  if (args.model) {
    console.error(`Curating with ${args.provider}/${args.model} …`);
    const promptTemplate = readFileSync(resolve(here, "../prompt.md"), "utf8");
    const prompt = [
      promptTemplate,
      "\n---\n## Deterministic facts (already extracted — do not restate)\n",
      JSON.stringify(prune(facts), null, 2),
      "\n---\n## Model card / metadata text\n",
      src.cardText || "(no model card available)",
    ].join("\n");
    const llmOpts: LlmOptions = { provider: args.provider, model: args.model, ollamaHost: args.ollamaHost };
    const raw = await chat(llmOpts, prompt);
    applyLlmPatch(facts, extractJson(raw) as Record<string, unknown>);
    facts.generated.generator = `${GENERATOR} (${args.provider}/${args.model})`;
  } else {
    facts.generated.generator = `${GENERATOR} (deterministic draft — review required)`;
  }

  const cleaned = prune(facts);

  // Validate before writing — never emit a file that fails the canonical schema.
  const schema = JSON.parse(readFileSync(resolve(here, "../../site/schema/model-facts.schema.json"), "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(cleaned)) {
    console.error("Generated frontmatter failed schema validation:");
    for (const err of validate.errors ?? []) console.error(`  ${err.instancePath || "(root)"} ${err.message}`);
    process.exit(1);
  }

  let frontmatter = yamlStringify(cleaned, { lineWidth: 0 }).trimEnd();
  if (!args.model) frontmatter = addTodoComments(frontmatter);

  const output = `---\n${frontmatter}\n---\n\n${renderBody(cleaned)}`;

  if (args.dryRun) {
    console.log(output);
  } else {
    const path = resolve(args.output);
    writeFileSync(path, output, "utf8");
    console.error(`Wrote ${path} (source: ${src.sourceLabel})`);
    if (!args.model) {
      console.error("Deterministic draft: fields marked '# TODO: verify' need human review,");
      console.error("or re-run with --provider/--model to curate from the model card.");
    }
  }
}

main().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
