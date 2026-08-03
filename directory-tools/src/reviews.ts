/**
 * Human-reviewed overlays for directory seed labels.
 * Only objective, published facts — prefer undisclosed over guesses.
 */
import type { ModelFacts } from "./types.js";

const TODAY = "2026-08-03";
const CREDITS = {
  generated_with: "https://modelfacts.dev",
  built_by: "Catalyst Forge — https://www.catalystforge.com/",
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Patches merged onto generator drafts (open-weight). */
export const openPatches: Record<string, DeepPartial<ModelFacts>> = {
  "meta-llama-3.1-8b-instruct": {
    developer: "Meta",
    architecture: {
      type: "dense transformer (decoder-only)",
      parameters: "8B",
      context_window: "128k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "2023-12",
      methodology: "pre-training → SFT → RLHF (rejection sampling + DPO)",
      tokens: "15T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      languages: "8 languages officially supported",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
    benchmarks: [
      { name: "MMLU", score: 69.4, notes: "5-shot" },
      { name: "HumanEval", score: 72.6, notes: "pass@1" },
    ],
  },
  "meta-llama-3.1-70b-instruct": {
    developer: "Meta",
    architecture: {
      type: "dense transformer (decoder-only)",
      parameters: "70B",
      context_window: "128k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "2023-12",
      methodology: "pre-training → SFT → RLHF (rejection sampling + DPO)",
      tokens: "15T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      languages: "8 languages officially supported",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
      hallucination_benchmark: { name: "TruthfulQA", score: 0.6 },
    },
    benchmarks: [
      { name: "MMLU", score: 83.6, notes: "5-shot" },
      { name: "GSM8K", score: 95.1, notes: "8-shot CoT" },
      { name: "HumanEval", score: 80.5, notes: "pass@1" },
    ],
  },
  "meta-llama-3.1-405b-instruct": {
    developer: "Meta",
    architecture: {
      type: "dense transformer (decoder-only)",
      parameters: "405B",
      context_window: "128k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "2023-12",
      methodology: "pre-training → SFT → RLHF (rejection sampling + DPO)",
      tokens: "15T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      languages: "8 languages officially supported",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
    benchmarks: [
      { name: "MMLU", score: 88.6, notes: "5-shot" },
      { name: "HumanEval", score: 89.0, notes: "pass@1" },
    ],
  },
  "meta-llama-3.3-70b-instruct": {
    developer: "Meta",
    architecture: {
      type: "dense transformer (decoder-only)",
      parameters: "70B",
      context_window: "128k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "2023-12",
      methodology: "pre-training → SFT → RLHF (DPO); Llama 3.3 post-train refresh of 3.1 70B",
      tokens: "15T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      languages: "8 languages officially supported",
      notes: "Post-trained to approach 405B quality on many text tasks",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "qwen-qwen2.5-7b-instruct": {
    developer: "Alibaba (Qwen)",
    architecture: { context_window: "128k", quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RLHF",
      tokens: "18T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      languages: "29+ languages",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "qwen-qwen2.5-72b-instruct": {
    developer: "Alibaba (Qwen)",
    architecture: { context_window: "128k", quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RLHF",
      tokens: "18T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      languages: "29+ languages",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "qwen-qwen2.5-coder-32b-instruct": {
    developer: "Alibaba (Qwen)",
    architecture: { context_window: "128k", quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "code-heavy pre-training → SFT → RLHF",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Code-specialized Qwen2.5 variant",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "qwen-qwen3-32b": {
    developer: "Alibaba (Qwen)",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RL (thinking / non-thinking modes)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Supports explicit thinking mode for harder reasoning",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "mistral-7b-instruct-v0.3": {
    developer: "Mistral AI",
    architecture: { context_window: "32k", quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
    },
    safety: {
      refusal_sensitivity: "low",
      instruction_following: "high",
      filter_type: "raw",
    },
  },
  "mistral-small-24b-instruct-2501": {
    developer: "Mistral AI",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → preference optimization",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "mistral-mixtral-8x22b-instruct": {
    developer: "Mistral AI",
    architecture: {
      type: "mixture of experts (MoE)",
      parameters: "8x22B",
      active_parameters: "39B",
      context_window: "64k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
    },
    safety: {
      refusal_sensitivity: "low",
      instruction_following: "high",
      filter_type: "raw",
    },
  },
  "mistral-large-instruct-2411": {
    developer: "Mistral AI",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → preference optimization",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "google-gemma-2-9b-it": {
    developer: "Google",
    architecture: { context_window: "8k", quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RLHF",
      tokens: "8T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "prompted",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "google-gemma-2-27b-it": {
    developer: "Google",
    architecture: { context_window: "8k", quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RLHF",
      tokens: "13T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "prompted",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "google-gemma-3-27b-it": {
    developer: "Google",
    architecture: {
      quantization: "bf16",
      modalities_in: ["text", "image"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RLHF",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Multimodal Gemma 3 instruct variant",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "deepseek-v3": {
    developer: "DeepSeek",
    license: "MIT",
    architecture: {
      type: "mixture of experts (MoE)",
      parameters: "671B",
      active_parameters: "37B",
      context_window: "128k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → RL",
      tokens: "14.8T",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
    },
    safety: {
      refusal_sensitivity: "low",
      instruction_following: "high",
      filter_type: "raw",
    },
  },
  "deepseek-r1": {
    developer: "DeepSeek",
    license: "MIT",
    architecture: {
      type: "mixture of experts (MoE)",
      parameters: "671B",
      active_parameters: "37B",
      context_window: "128k",
      quantization: "bf16",
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "DeepSeek-V3 base → large-scale RL for reasoning (R1)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Reasoning-first model; long chain-of-thought by default",
    },
    safety: {
      refusal_sensitivity: "low",
      instruction_following: "high",
      filter_type: "raw",
    },
  },
  "microsoft-phi-4": {
    developer: "Microsoft",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → DPO (synthetic + organic data mix)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "prompted",
      notes: "Small model tuned for reasoning density",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "cohere-command-r-plus-08-2024": {
    developer: "Cohere",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → preference optimization",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "medium",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Optimized for RAG and tool use",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
  "allenai-olmo-2-13b-instruct": {
    developer: "Allen Institute for AI",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "fully open pre-training → SFT → DPO (Dolci)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "prompted",
      notes: "Open data, code, and weights (OLMo lineage)",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "medium",
      filter_type: "hybrid",
    },
  },
  "ibm-granite-3.1-8b-instruct": {
    developer: "IBM",
    architecture: { quantization: "bf16" },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "pre-training → SFT → preference optimization",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "medium",
      coding: "medium",
      vision_input: "disabled",
      audio_input: "disabled",
      tool_use: "native",
    },
    safety: {
      refusal_sensitivity: "medium",
      instruction_following: "high",
      filter_type: "hybrid",
    },
  },
};

/** Full hand-authored labels for closed / API models. */
export const closedFacts: Record<string, ModelFacts> = {
  "openai-gpt-4o": {
    model_facts_version: "0.1.0",
    name: "GPT-4o",
    developer: "OpenAI",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2024-05-13",
    homepage: "https://openai.com/index/hello-gpt-4o/",
    architecture: {
      type: "undisclosed (transformer-family)",
      parameters: "undisclosed",
      context_window: "128k",
      quantization: "undisclosed",
      modalities_in: ["text", "image", "audio"],
      modalities_out: ["text", "audio"],
    },
    training: {
      knowledge_cutoff: "2023-10",
      methodology: "undisclosed",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "enabled",
      tool_use: "native",
      notes: "Omni multimodal flagship; weights not published",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "censored",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
  "openai-o3": {
    model_facts_version: "0.1.0",
    name: "o3",
    developer: "OpenAI",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2025-04-16",
    homepage: "https://openai.com/index/introducing-o3-and-o4-mini/",
    architecture: {
      type: "undisclosed (reasoning model)",
      parameters: "undisclosed",
      context_window: "200k",
      quantization: "undisclosed",
      modalities_in: ["text", "image"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed (large-scale RL for reasoning)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Deliberative reasoning model; latency/cost trade off for harder tasks",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "censored",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
  "anthropic-claude-sonnet-4": {
    model_facts_version: "0.1.0",
    name: "Claude Sonnet 4",
    developer: "Anthropic",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2025-05-22",
    homepage: "https://www.anthropic.com/news/claude-4",
    architecture: {
      type: "undisclosed (transformer-family)",
      parameters: "undisclosed",
      context_window: "200k",
      quantization: "undisclosed",
      modalities_in: ["text", "image"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed (Constitutional AI / RLHF lineage)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Balanced Claude 4 tier for coding and agents",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "censored",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
  "anthropic-claude-opus-4": {
    model_facts_version: "0.1.0",
    name: "Claude Opus 4",
    developer: "Anthropic",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2025-05-22",
    homepage: "https://www.anthropic.com/news/claude-4",
    architecture: {
      type: "undisclosed (transformer-family)",
      parameters: "undisclosed",
      context_window: "200k",
      quantization: "undisclosed",
      modalities_in: ["text", "image"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed (Constitutional AI / RLHF lineage)",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "Highest Claude 4 tier; weights not published",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "censored",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
  "google-gemini-2.5-pro": {
    model_facts_version: "0.1.0",
    name: "Gemini 2.5 Pro",
    developer: "Google DeepMind",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2025-03-25",
    homepage: "https://deepmind.google/models/gemini/pro/",
    architecture: {
      type: "undisclosed (transformer-family)",
      parameters: "undisclosed",
      context_window: "1M",
      quantization: "undisclosed",
      modalities_in: ["text", "image", "audio", "video"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "enabled",
      tool_use: "native",
      notes: "Long-context multimodal Pro tier; weights not published",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "censored",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
  "google-gemini-2.5-flash": {
    model_facts_version: "0.1.0",
    name: "Gemini 2.5 Flash",
    developer: "Google DeepMind",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2025-04-17",
    homepage: "https://deepmind.google/models/gemini/flash/",
    architecture: {
      type: "undisclosed (transformer-family)",
      parameters: "undisclosed",
      context_window: "1M",
      quantization: "undisclosed",
      modalities_in: ["text", "image", "audio", "video"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "enabled",
      tool_use: "native",
      notes: "Latency/cost-oriented Flash tier with thinking option",
    },
    safety: {
      refusal_sensitivity: "high",
      instruction_following: "high",
      filter_type: "censored",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
  "xai-grok-3": {
    model_facts_version: "0.1.0",
    name: "Grok 3",
    developer: "xAI",
    status: "active",
    license: "Proprietary (API)",
    release_date: "2025-02-17",
    homepage: "https://x.ai/news/grok-3",
    architecture: {
      type: "undisclosed (transformer-family)",
      parameters: "undisclosed",
      context_window: "undisclosed",
      quantization: "undisclosed",
      modalities_in: ["text", "image"],
      modalities_out: ["text"],
    },
    training: {
      knowledge_cutoff: "undisclosed",
      methodology: "undisclosed",
      tokens: "undisclosed",
    },
    capabilities: {
      natural_language: "full",
      reasoning_math: "high",
      coding: "high",
      vision_input: "enabled",
      audio_input: "disabled",
      tool_use: "native",
      notes: "xAI flagship API model; most training facts unpublished",
    },
    safety: {
      refusal_sensitivity: "low",
      instruction_following: "high",
      filter_type: "hybrid",
    },
    generated: { date: TODAY, generator: "hand-authored (directory seed)" },
    credits: CREDITS,
  },
};

export function deepMerge<T extends Record<string, unknown>>(base: T, patch: DeepPartial<T>): T {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    const prev = out[k];
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[k] = deepMerge(prev as Record<string, unknown>, v as DeepPartial<Record<string, unknown>>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

export function markReviewed(facts: ModelFacts): ModelFacts {
  return {
    ...facts,
    model_facts_version: "0.1.0",
    generated: {
      date: TODAY,
      generator: "directory seed — human-reviewed judgment fields",
    },
    credits: { ...CREDITS, ...facts.credits },
  };
}
