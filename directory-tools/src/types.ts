/** Shared types for directory sync / review. */

export type Level = "high" | "medium" | "low";
export type Toggle = "enabled" | "disabled";

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
    data_composition?: Array<{
      component: string;
      percent: number | "undisclosed";
      source_type: string;
      purpose: string;
    }>;
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
  benchmarks?: Array<{ name: string; score: number; notes?: string }>;
  generated: { date: string; generator: string };
  credits?: { generated_with?: string; built_by?: string };
}

export interface ManifestModel {
  slug: string;
  weight_access: "open" | "closed";
  curation: "draft" | "reviewed";
  source:
    | { type: "huggingface"; id: string }
    | { type: "ollama"; id: string }
    | { type: "hand" };
  ollama_pulls?: string;
}

export interface Manifest {
  manifest_version: string;
  models: ManifestModel[];
}

export interface CatalogEntry {
  slug: string;
  name: string;
  developer: string;
  status: string;
  license: string;
  weight_access: "open" | "closed";
  curation: "draft" | "reviewed";
  parameters: string;
  /** Numeric billions for filtering; null when undisclosed / unparseable. */
  parameters_b: number | null;
  context_window: string;
  /** Numeric tokens for filtering; null when undisclosed / unparseable. */
  context_tokens: number | null;
  release_date?: string;
  filter_type: string;
  vision_input: "enabled" | "disabled";
  audio_input: "enabled" | "disabled";
  tool_use: "native" | "prompted" | "none" | null;
  reasoning_math: "high" | "medium" | "low";
  coding: "high" | "medium" | "low";
  refusal_sensitivity: "high" | "medium" | "low";
  instruction_following: "high" | "medium" | "low";
  href: string;
  facts_json: string;
  facts_md: string;
}

export interface Catalog {
  directory_version: string;
  generated: string;
  count: number;
  models: CatalogEntry[];
}
