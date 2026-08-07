/**
 * Directory-only selection enrichments (Phase 1).
 * Prefer published facts; never invent closed-lab sizes or prices.
 */
import type {
  CatalogEntry,
  CommercialOk,
  ManifestModel,
  ModelFacts,
  PriceTier,
  SelectionEnrichment,
  SpeedTier,
} from "./types.js";

/** Per-slug overrides / hand-authored selection fields. */
export const selectionBySlug: Record<string, SelectionEnrichment> = {
  "google-gemma-4-31b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "conditional",
  },
  "qwen-qwen3.5-35b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
  },
  "qwen-qwen3.6-35b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
  },
  "nvidia-nemotron-3-super": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "conditional",
  },
  "zai-glm-5.1": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
  },
  "minimax-m2.7": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
  },
  "liquid-lfm2": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
    vram_gb_q4: 14,
  },
  "nvidia-nemotron-3-nano-omni": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "conditional",
  },
  "moonshot-kimi-k2.6": {
    speed_tier: "flagship",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
  },
  "minimax-m3": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
  },
  "ornith-35b": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "undisclosed",
  },
  "deepseek-v4-flash": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "yes",
  },
  "ibm-granite-4.1": {
    speed_tier: "flash",
    price_tier: "free_local",
    commercial_ok: "yes",
    vram_gb_q4: 5,
  },
  "deepseek-v4-pro": {
    speed_tier: "flagship",
    price_tier: "free_local",
    commercial_ok: "yes",
  },
  "mistral-medium-3.5": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "conditional",
  },
  "zai-glm-5.2": {
    speed_tier: "standard",
    price_tier: "free_local",
    commercial_ok: "yes",
  },
  "openai-gpt-5.6-sol": {
    api_ids: ["gpt-5.6-sol"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
  },
  "openai-gpt-5.6-luna": {
    api_ids: ["gpt-5.6-luna"],
    speed_tier: "flash",
    price_tier: "api_budget",
    commercial_ok: "conditional",
  },
  "anthropic-claude-fable-5": {
    api_ids: ["claude-fable-5"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
  },
  "anthropic-claude-opus-5": {
    api_ids: ["claude-opus-5"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
  },
  "anthropic-claude-sonnet-5": {
    api_ids: ["claude-sonnet-5"],
    speed_tier: "standard",
    price_tier: "api_standard",
    commercial_ok: "conditional",
  },
  "google-gemini-3.1-pro": {
    api_ids: ["gemini-3.1-pro"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
  },
  "google-gemini-3.6-flash": {
    api_ids: ["gemini-3.6-flash"],
    speed_tier: "flash",
    price_tier: "api_budget",
    commercial_ok: "conditional",
  },
  "xai-grok-4.5": {
    api_ids: ["grok-4.5"],
    speed_tier: "flagship",
    price_tier: "api_premium",
    commercial_ok: "conditional",
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
  };
}
