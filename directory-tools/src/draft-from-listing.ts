import type { ModelFacts } from "./types.js";
import type { OllamaListing } from "./ollama-library.js";

const CREDITS = {
  generated_with: "https://modelfacts.dev",
  built_by: "Catalyst Forge — https://www.catalystforge.com/",
};

const VENDOR_PREFIX: Array<[RegExp, string]> = [
  [/^gemma/i, "google"],
  [/^qwen/i, "qwen"],
  [/^glm/i, "zai"],
  [/^nemotron/i, "nvidia"],
  [/^granite/i, "ibm"],
  [/^mistral|^mixtral|^devstral|^ministral/i, "mistral"],
  [/^deepseek/i, "deepseek"],
  [/^kimi/i, "moonshot"],
  [/^minimax/i, "minimax"],
  [/^lfm/i, "liquid"],
  [/^ornith/i, "ornith"],
  [/^llama/i, "meta"],
  [/^phi/i, "microsoft"],
  [/^command/i, "cohere"],
  [/^grok/i, "xai"],
];

export function vendorForLibrary(name: string): string {
  for (const [re, vendor] of VENDOR_PREFIX) {
    if (re.test(name)) return vendor;
  }
  return "ollama";
}

export function slugForLibrary(name: string, size?: string): string {
  const vendor = vendorForLibrary(name);
  const base = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  if (size) {
    const sz = size.toLowerCase().replace(/[^a-z0-9.]+/g, "");
    return `${vendor}-${base}-${sz}`;
  }
  return `${vendor}-${base}`;
}

function pickSize(sizes: string[]): string | undefined {
  if (sizes.length === 0) return undefined;
  const score = (s: string) => {
    const n = Number.parseFloat(s);
    if (s.endsWith("b") && !Number.isNaN(n)) return n;
    return 0;
  };
  return [...sizes].sort((a, b) => score(b) - score(a))[0];
}

export function draftFactsFromListing(item: OllamaListing): ModelFacts {
  const size = pickSize(item.sizes);
  const vision = item.capabilities.includes("vision") ? "enabled" : "disabled";
  const audio = item.capabilities.includes("audio") ? "enabled" : "disabled";
  const tools = item.capabilities.includes("tools") ? "native" : "none";
  const today = new Date().toISOString().slice(0, 10);
  return {
    model_facts_version: "0.1.0",
    name: item.name,
    developer: vendorForLibrary(item.name),
    status: "active",
    license: "UNKNOWN",
    homepage: item.url,
    weights: item.url,
    architecture: {
      type: "undisclosed",
      parameters: size ? size.toUpperCase() : "undisclosed",
      context_window: "undisclosed",
      quantization: "GGUF (Ollama default)",
      modalities_in: vision === "enabled" ? ["text", "image"] : ["text"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed (draft from Ollama library listing)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: vision,
      audio_input: audio,
      tool_use: tools,
      notes: item.description
        ? `Draft. ${item.description.slice(0, 220)}`
        : "Draft from Ollama listing — review before marking curated.",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "medium",
      filter_type: "hybrid",
    },
    generated: {
      date: today,
      generator: "directory refresh — Ollama listing draft",
    },
    credits: CREDITS,
  };
}

export function representativeOllamaId(item: OllamaListing): string {
  const size = pickSize(item.sizes);
  return size ? `${item.name}:${size}` : item.name;
}
