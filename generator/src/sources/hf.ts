/** Hugging Face source adapter: model API + config.json + raw model card. */
import {
  SourceFacts,
  Toggle,
  formatContextWindow,
  formatParamCount,
  formatQuantization,
  normalizeLicense,
} from "../facts.js";

const HF = "https://huggingface.co";

interface HfModelInfo {
  id: string;
  author?: string;
  pipeline_tag?: string;
  tags?: string[];
  createdAt?: string;
  cardData?: {
    license?: string | string[];
    license_name?: string;
    base_model?: string | string[];
    language?: string | string[];
  };
  config?: { model_type?: string; architectures?: string[] };
  safetensors?: { total?: number };
  gated?: boolean | string;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

async function fetchText(url: string): Promise<string | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.text();
}

/** Accepts "org/name", "hf:org/name", or a full huggingface.co URL. */
export function parseHfId(target: string): string {
  let t = target.replace(/^hf:/, "");
  const m = /^https?:\/\/huggingface\.co\/([^/]+\/[^/?#]+)/.exec(t);
  if (m) t = m[1];
  if (!/^[\w.-]+\/[\w.-]+$/.test(t)) {
    throw new Error(`Not a Hugging Face model id or URL: ${target}`);
  }
  return t;
}

const VISION_PIPELINES = new Set([
  "image-text-to-text",
  "visual-question-answering",
  "video-text-to-text",
  "image-to-text",
]);
const AUDIO_PIPELINES = new Set(["audio-text-to-text", "any-to-any"]);

export async function fromHuggingFace(target: string): Promise<SourceFacts> {
  const id = parseHfId(target);
  const info = await fetchJson<HfModelInfo>(`${HF}/api/models/${id}`);
  if (!info) throw new Error(`Model not found on Hugging Face: ${id}`);

  // config.json may be gated/absent (e.g. GGUF-only repos) — degrade gracefully.
  const config = await fetchJson<Record<string, unknown>>(`${HF}/${id}/raw/main/config.json`);
  const card = (await fetchText(`${HF}/${id}/raw/main/README.md`)) ?? "";

  const tags = info.tags ?? [];
  const cardData = info.cardData ?? {};
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  // Architecture type
  const numExperts = (config?.num_local_experts ?? config?.num_experts) as number | undefined;
  const isMoe = typeof numExperts === "number" && numExperts > 1;
  let architectureType: string | undefined;
  if (config || info.config) {
    architectureType = isMoe
      ? `mixture of experts (MoE, ${numExperts} experts)`
      : "dense transformer (decoder-only)";
  }

  // Modalities
  const pipeline = info.pipeline_tag ?? "";
  const visionInput: Toggle =
    VISION_PIPELINES.has(pipeline) || tags.includes("vision") || tags.includes("multimodal")
      ? "enabled"
      : "disabled";
  const audioInput: Toggle = AUDIO_PIPELINES.has(pipeline) || tags.includes("audio") ? "enabled" : "disabled";
  const toolUse = tags.some((t) => /function[- ]?calling|tool[- ]?use/i.test(t)) ? ("native" as const) : undefined;

  const maxPos = config?.max_position_embeddings as number | undefined;
  const dtype = config?.torch_dtype as string | undefined;

  // Strip the card's own YAML frontmatter; cap what we hand to the LLM.
  const cardBody = card.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").slice(0, 14000);

  return {
    name: id.split("/")[1],
    developer: info.author ?? id.split("/")[0],
    license: normalizeLicense(first(cardData.license), cardData.license_name),
    releaseDate: info.createdAt?.slice(0, 10),
    weights: `${HF}/${id}`,
    baseModel: first(cardData.base_model),
    architectureType,
    parameters: info.safetensors?.total ? formatParamCount(info.safetensors.total) : undefined,
    contextWindow: typeof maxPos === "number" ? formatContextWindow(maxPos) : undefined,
    quantization: dtype ? formatQuantization(dtype) : undefined,
    visionInput,
    audioInput,
    toolUse,
    cardText: cardBody,
    sourceLabel: `huggingface.co/${id}`,
  };
}
