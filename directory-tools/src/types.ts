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

export type CommercialOk = "yes" | "no" | "conditional" | "undisclosed";
export type PriceTier =
  | "free_local"
  | "api_budget"
  | "api_standard"
  | "api_premium"
  | "undisclosed";
export type SpeedTier = "flash" | "standard" | "flagship" | "undisclosed";
/** How capability/safety enums were set. `measured` reserved for a future harness. */
export type CapabilityBasis = "claimed" | "reviewed_claim" | "measured";

export interface JudgmentSource {
  label: string;
  url: string;
}

/** Directory-only selection fields (not part of MODEL_FACTS.md schema). */
export interface SelectionEnrichment {
  api_ids?: string[];
  ollama_tag?: string | null;
  hf_id?: string | null;
  commercial_ok?: CommercialOk;
  price_tier?: PriceTier;
  vram_gb_q4?: number | null;
  speed_tier?: SpeedTier;
  family?: string | null;
  related_slugs?: string[];
  judgment_sources?: JudgmentSource[];
  capability_basis?: CapabilityBasis;
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
  /** ISO date from the Ollama library "Updated" timestamp, if known. */
  ollama_updated?: string;
  hf_downloads?: number;
  hf_updated?: string;
}

export interface Manifest {
  manifest_version: string;
  last_refreshed?: string;
  selection?: { open?: string; closed?: string };
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
  /** From training.knowledge_cutoff; null if undisclosed. */
  knowledge_cutoff: string | null;
  /** Provider / routing model ids when known. */
  api_ids: string[];
  ollama_tag: string | null;
  hf_id: string | null;
  commercial_ok: CommercialOk;
  price_tier: PriceTier;
  /** Rough local Q4 VRAM proxy in GB; null if unknown / closed. */
  vram_gb_q4: number | null;
  speed_tier: SpeedTier;
  capability_basis: CapabilityBasis;
  /** Product family key for size ladders / pairing (not cross-lab equivalence). */
  family: string | null;
  related_slugs: string[];
  judgment_sources: JudgmentSource[];
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
