/**
 * Directory-only selection enrichments (Phases 1–5).
 * Prefer published facts; never invent closed-lab sizes or prices.
 */
import type {
  CapabilityBasis,
  CatalogEntry,
  CommercialOk,
  JudgmentSource,
  ManifestModel,
  ModelFacts,
  PriceTier,
  SelectionEnrichment,
  SpeedTier,
} from "./types.js";

/** Per-slug overrides / hand-authored selection fields. */
export const selectionBySlug: Record<string, SelectionEnrichment> = {
  "google-gemma-4-12b": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "conditional",
    family: "google-gemma-4",
    related_slugs: ["google-gemma-4-31b"],
    vram_gb_q4: 7,
  },
  "google-gemma-4-31b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "conditional",
    family: "google-gemma-4",
    related_slugs: ["google-gemma-4-12b"],
  },
  "qwen-qwen3.5-35b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
    family: "qwen-qwen3.5",
  },
  "qwen-qwen3.6-35b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
    family: "qwen-qwen3.6",
  },
  "nvidia-nemotron-3-super": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "conditional",
    family: "nvidia-nemotron-3",
    related_slugs: ["nvidia-nemotron-3-nano-omni"],
  },
  "zai-glm-5.1": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
    family: "zai-glm-5",
    related_slugs: ["zai-glm-5.2"],
  },
  "minimax-m2.7": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
    family: "minimax-m",
    related_slugs: ["minimax-m3"],
  },
  "liquid-lfm2": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
    vram_gb_q4: 14,
    family: "liquid-lfm2",
  },
  "nvidia-nemotron-3-nano-omni": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "conditional",
    family: "nvidia-nemotron-3",
    related_slugs: ["nvidia-nemotron-3-super"],
  },
  "moonshot-kimi-k2.6": {
    speed_tier: "flagship",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
    family: "moonshot-kimi",
  },
  "minimax-m3": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
    family: "minimax-m",
    related_slugs: ["minimax-m2.7"],
  },
  "ornith-35b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
    family: "ornith",
  },
  "deepseek-v4-flash": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "yes",
    family: "deepseek-v4",
    related_slugs: ["deepseek-v4-pro"],
  },
  "ibm-granite-4.1": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "yes",
    vram_gb_q4: 5,
    family: "ibm-granite-4",
  },
  "deepseek-v4-pro": {
    speed_tier: "flagship",
    price_tier: "free_local",
    commercial_ok: "yes",
    family: "deepseek-v4",
    related_slugs: ["deepseek-v4-flash"],
  },
  "mistral-medium-3.5": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "conditional",
    family: "mistral-medium",
  },
  "zai-glm-5.2": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
    family: "zai-glm-5",
    related_slugs: ["zai-glm-5.1"],
  },
  "openai-gpt-5.6-sol": {
    api_ids: ["gpt-5.6-sol"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
    family: "openai-gpt-5.6",
    related_slugs: ["openai-gpt-5.6-luna"],
    judgment_sources: [
      { label: "OpenAI GPT-5.6 docs", url: "https://developers.openai.com/api/docs/models/gpt-5.6-sol" },
    ],
  },
  "openai-gpt-5.6-luna": {
    api_ids: ["gpt-5.6-luna"],
    speed_tier: "flash",
    price_tier: "api_budget",
    commercial_ok: "conditional",
    family: "openai-gpt-5.6",
    related_slugs: ["openai-gpt-5.6-sol"],
    judgment_sources: [
      { label: "OpenAI GPT-5.6 docs", url: "https://developers.openai.com/api/docs/models/gpt-5.6-luna" },
    ],
  },
  "anthropic-claude-fable-5": {
    api_ids: ["claude-fable-5"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
    family: "anthropic-claude-5",
    related_slugs: ["anthropic-claude-opus-5", "anthropic-claude-sonnet-5"],
  },
  "anthropic-claude-opus-5": {
    api_ids: ["claude-opus-5"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
    family: "anthropic-claude-5",
    related_slugs: ["anthropic-claude-fable-5", "anthropic-claude-sonnet-5"],
  },
  "anthropic-claude-sonnet-5": {
    api_ids: ["claude-sonnet-5"],
    speed_tier: "standard",
    price_tier: "api_standard",
    commercial_ok: "conditional",
    family: "anthropic-claude-5",
    related_slugs: ["anthropic-claude-fable-5", "anthropic-claude-opus-5"],
  },
  "google-gemini-3.1-pro": {
    api_ids: ["gemini-3.1-pro"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
    family: "google-gemini-3",
    related_slugs: ["google-gemini-3.6-flash"],
  },
  "google-gemini-3.6-flash": {
    api_ids: ["gemini-3.6-flash"],
    speed_tier: "flash",
    price_tier: "api_budget",
    commercial_ok: "conditional",
    family: "google-gemini-3",
    related_slugs: ["google-gemini-3.1-pro"],
  },
  "xai-grok-4.5": {
    api_ids: ["grok-4.5"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
    family: "xai-grok-4",
  },
};

export function parseHfId(weights?: string): string | null {
  if (!weights) return null;
  try {
    const u = new URL(weights);
    if (!u.hostname.includes("huggingface.co")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch {
    /* ignore */
  }
  return null;
}

export function knowledgeCutoffOrNull(raw: string): string | null {
  const s = raw.trim();
  if (!s || s.toLowerCase() === "undisclosed") return null;
  return s;
}

/** Rough Q4 VRAM proxy (GB): ~0.55 GB per billion params. */
export function estimateVramGbQ4(parametersB: number | null): number | null {
  if (parametersB == null || parametersB <= 0) return null;
  return Math.max(1, Math.round(parametersB * 0.55));
}

export function commercialFromLicense(license: string): CommercialOk {
  const l = license.toLowerCase();
  if (l.includes("apache-2.0") || l === "mit" || l.startsWith("mit ")) return "yes";
  if (l.includes("proprietary") || l.includes("api")) return "conditional";
  if (l.includes("gemma") || l.includes("nvidia") || l.includes("llama") || l.includes("modified")) {
    return "conditional";
  }
  if (l.includes("unknown") || l.includes("undisclosed")) return "undisclosed";
  return "undisclosed";
}

export function defaultPriceTier(weightAccess: "open" | "closed"): PriceTier {
  return weightAccess === "open" ? "free_local" : "undisclosed";
}

export function defaultSpeedTier(): SpeedTier {
  return "undisclosed";
}

function defaultJudgmentSources(facts: ModelFacts): JudgmentSource[] {
  const out: JudgmentSource[] = [];
  if (facts.homepage) out.push({ label: "Homepage / docs", url: facts.homepage });
  if (facts.weights && facts.weights !== facts.homepage) {
    out.push({ label: "Weights / library", url: facts.weights });
  }
  if (facts.repository) out.push({ label: "Repository", url: facts.repository });
  return out;
}

function capabilityBasis(curation: ManifestModel["curation"], override?: CapabilityBasis): CapabilityBasis {
  if (override) return override;
  return curation === "reviewed" ? "reviewed_claim" : "claimed";
}

export function buildSelectionFields(
  manifest: ManifestModel,
  facts: ModelFacts,
  parametersB: number | null,
): Pick<
  CatalogEntry,
  | "knowledge_cutoff"
  | "api_ids"
  | "ollama_tag"
  | "hf_id"
  | "commercial_ok"
  | "price_tier"
  | "vram_gb_q4"
  | "speed_tier"
  | "capability_basis"
  | "family"
  | "related_slugs"
  | "judgment_sources"
> {
  const override = selectionBySlug[manifest.slug] ?? {};
  const ollamaTag =
    override.ollama_tag !== undefined
      ? override.ollama_tag
      : manifest.source.type === "ollama"
        ? manifest.source.id
        : null;
  const hfFromSource =
    manifest.source.type === "huggingface" ? manifest.source.id : null;
  const hfId =
    override.hf_id !== undefined
      ? override.hf_id
      : hfFromSource ?? parseHfId(facts.weights);

  return {
    knowledge_cutoff: knowledgeCutoffOrNull(facts.training.knowledge_cutoff),
    api_ids: override.api_ids ?? [],
    ollama_tag: ollamaTag,
    hf_id: hfId,
    commercial_ok: override.commercial_ok ?? commercialFromLicense(facts.license),
    price_tier: override.price_tier ?? defaultPriceTier(manifest.weight_access),
    vram_gb_q4:
      override.vram_gb_q4 !== undefined
        ? override.vram_gb_q4
        : manifest.weight_access === "open"
          ? estimateVramGbQ4(parametersB)
          : null,
    speed_tier: override.speed_tier ?? defaultSpeedTier(),
    capability_basis: capabilityBasis(manifest.curation, override.capability_basis),
    family: override.family ?? null,
    related_slugs: override.related_slugs ?? [],
    judgment_sources:
      override.judgment_sources && override.judgment_sources.length > 0
        ? override.judgment_sources
        : defaultJudgmentSources(facts),
  };
}
