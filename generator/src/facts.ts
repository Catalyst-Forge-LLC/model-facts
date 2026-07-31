/** Shared types and formatting helpers for the ModelFacts generator. */

export type Level = "high" | "medium" | "low";
export type Toggle = "enabled" | "disabled";

export interface DataComposition {
  component: string;
  percent: number | "undisclosed";
  source_type: string;
  purpose: string;
}

export interface Benchmark {
  name: string;
  score: number;
  notes?: string;
}

export interface ModelFacts {
  model_facts_version: string;
  name: string;
  developer: string;
  status: "active" | "deprecated" | "preview" | "archived";
  license: string;
  release_date?: string;
  homepage?: string;
  repository?: string;
  weights?: string;
  base_model?: string;
  architecture: {
    type: string;
    parameters: string;
    active_parameters?: string;
    context_window: string;
    quantization: string;
    modalities_in?: string[];
    modalities_out?: string[];
  };
  training: {
    knowledge_cutoff: string;
    methodology: string;
    tokens?: string;
    data_composition?: DataComposition[];
  };
  capabilities: {
    natural_language: "full" | "limited";
    reasoning_math: Level;
    coding: Level;
    vision_input: Toggle;
    audio_input: Toggle;
    tool_use?: "native" | "prompted" | "none";
    languages?: string;
    notes?: string;
  };
  safety: {
    refusal_sensitivity: Level;
    instruction_following: Level;
    filter_type: "raw" | "censored" | "hybrid";
    hallucination_benchmark?: { name: string; score: number };
  };
  benchmarks?: Benchmark[];
  generated: { date: string; generator: string };
  credits?: { generated_with?: string; built_by?: string };
}

/** What a source adapter can determine deterministically, plus context for LLM curation. */
export interface SourceFacts {
  name: string;
  developer?: string;
  license?: string;
  releaseDate?: string;
  homepage?: string;
  weights?: string;
  baseModel?: string;
  architectureType?: string;
  parameters?: string;
  activeParameters?: string;
  contextWindow?: string;
  quantization?: string;
  visionInput?: Toggle;
  audioInput?: Toggle;
  toolUse?: "native" | "prompted" | "none";
  /** Model card / metadata text handed to the LLM for curation (never invented). */
  cardText: string;
  sourceLabel: string;
}

/** 7615616512 -> "7.6B", 11907350576 -> "11.9B", 1234000000000 -> "1.2T" */
export function formatParamCount(n: number): string {
  const units: Array<[number, string]> = [
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
  ];
  for (const [div, suffix] of units) {
    if (n >= div) {
      const v = n / div;
      const s = v >= 10 ? v.toFixed(1) : v.toFixed(2);
      return `${s.replace(/\.?0+$/, "")}${suffix}`;
    }
  }
  return String(n);
}

/** 32768 -> "32k", 262144 -> "256k", 8192 -> "8k", 200000 -> "200k" */
export function formatContextWindow(tokens: number): string {
  if (tokens >= 1024 && tokens % 1024 === 0) return `${tokens / 1024}k`;
  if (tokens >= 1000 && tokens % 1000 === 0) return `${tokens / 1000}k`;
  return String(tokens);
}

const DTYPE_MAP: Record<string, string> = {
  bfloat16: "bf16",
  float16: "fp16",
  float32: "fp32",
  int8: "8-bit",
  int4: "4-bit",
};

export function formatQuantization(dtype: string): string {
  return DTYPE_MAP[dtype.toLowerCase()] ?? dtype;
}

const LICENSE_MAP: Record<string, string> = {
  "apache-2.0": "Apache-2.0",
  mit: "MIT",
  "cc-by-4.0": "CC-BY-4.0",
  "cc-by-sa-4.0": "CC-BY-SA-4.0",
  "cc-by-nc-4.0": "CC-BY-NC-4.0",
  openrail: "OpenRAIL",
  "bigscience-openrail-m": "BigScience OpenRAIL-M",
  llama2: "Llama 2 Community License",
  llama3: "Llama 3 Community License",
  "llama3.1": "Llama 3.1 Community License",
  "llama3.2": "Llama 3.2 Community License",
  "llama3.3": "Llama 3.3 Community License",
  gemma: "Gemma Terms of Use",
};

export function normalizeLicense(raw?: string, licenseName?: string): string {
  if (!raw && !licenseName) return "UNKNOWN";
  if (raw && LICENSE_MAP[raw.toLowerCase()]) return LICENSE_MAP[raw.toLowerCase()];
  if (raw?.toLowerCase() === "other" && licenseName) return licenseName;
  return licenseName ?? raw ?? "UNKNOWN";
}
