/**
 * Hugging Face Hub listing for directory refresh (official API).
 * Finds models people run outside Ollama (vLLM, llama.cpp, LM Studio, transformers).
 */
const UA = "ModelFactsDirectory/0.3 (+https://modelfacts.dev; weekly catalog refresh)";
const HF = "https://huggingface.co";

const PIPELINES = ["text-generation", "image-text-to-text", "any-to-any"] as const;

/** Community quant / remux orgs — not original model cards. */
const SKIP_AUTHORS = new Set(
  [
    "thebloke",
    "bartowski",
    "mradermacher",
    "maziyarpanahi",
    "lonestriker",
    "quantfactory",
    "lmstudio-community",
    "ggml-org",
    "second-state",
    "trl-internal-testing",
    "hf-internal-testing",
    "tiny-random",
  ].map((s) => s.toLowerCase()),
);

const SKIP_NAME =
  /(?:^|[-_])(tiny|dummy|test|random|gguf|ggml|awq|gptq|exl2|fp8|nvfp4|int4|int8|bnb|ocr)(?:[-_]|$)|mlx[-_]?\d*bit/i;

export interface HfListing {
  id: string;
  author: string;
  name: string;
  downloads: number;
  likes: number;
  last_modified: string | null;
  pipeline_tag: string;
  tags: string[];
  gated: boolean;
  license: string | null;
  url: string;
}

export function compactId(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Family key for “one size per family”: strip size + instruct suffix. */
export function hfFamilyKey(id: string): string {
  const repo = id.split("/")[1] ?? id;
  return compactId(
    repo
      .replace(/[-_]?(fp8|nvfp4|awq|gptq|int4|int8|bnb|mlx[-_]?\d*bit)$/i, "")
      .replace(/[-_]?(\d+\.?\d*)[bB]\b.*$/g, "")
      .replace(/[-_]?(instruct|chat|it|hf)$/i, ""),
  );
}

function isGeneralPurposeLlm(row: {
  id: string;
  pipeline_tag?: string;
  tags?: string[];
}): boolean {
  const repo = row.id.split("/")[1] ?? row.id;
  if (/ocr/i.test(repo)) return false;
  const tags = row.tags ?? [];
  const pipeline = row.pipeline_tag ?? "";
  if (pipeline === "text-generation" || pipeline === "any-to-any") return true;
  if (pipeline === "image-text-to-text") {
    return tags.includes("conversational") || tags.includes("multimodal");
  }
  return false;
}

function isQuantDump(row: {
  id: string;
  author?: string;
  tags?: string[];
  library_name?: string;
}): boolean {
  const author = (row.author ?? row.id.split("/")[0] ?? "").toLowerCase();
  const repo = row.id.split("/")[1] ?? row.id;
  if (SKIP_AUTHORS.has(author)) return true;
  if (SKIP_NAME.test(repo)) return true;
  const tags = row.tags ?? [];
  const ggufOnly = tags.includes("gguf") && !tags.includes("transformers") && !tags.includes("safetensors");
  return ggufOnly;
}

function parseLicense(tags: string[]): string | null {
  const hit = tags.find((t) => t.startsWith("license:"));
  return hit ? hit.slice("license:".length) : null;
}

export async function fetchHfPipeline(pipeline: string, limit = 100): Promise<HfListing[]> {
  const url = `${HF}/api/models?pipeline_tag=${encodeURIComponent(pipeline)}&sort=downloads&direction=-1&limit=${limit}&full=true`;
  const res = await fetch(url, { headers: { accept: "application/json", "user-agent": UA } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const rows = (await res.json()) as Array<{
    id: string;
    author?: string;
    downloads?: number;
    likes?: number;
    lastModified?: string;
    pipeline_tag?: string;
    tags?: string[];
    gated?: boolean | string;
    library_name?: string;
  }>;
  return rows
    .filter((r) => !isQuantDump(r))
    .filter((r) => isGeneralPurposeLlm(r))
    .map((r) => ({
      id: r.id,
      author: r.author ?? r.id.split("/")[0] ?? "",
      name: r.id.split("/")[1] ?? r.id,
      downloads: r.downloads ?? 0,
      likes: r.likes ?? 0,
      last_modified: r.lastModified ?? null,
      pipeline_tag: r.pipeline_tag ?? pipeline,
      tags: r.tags ?? [],
      gated: Boolean(r.gated),
      license: parseLicense(r.tags ?? []),
      url: `${HF}/${r.id}`,
    }));
}

export async function fetchHfListings(): Promise<HfListing[]> {
  const byId = new Map<string, HfListing>();
  for (const pipeline of PIPELINES) {
    const batch = await fetchHfPipeline(pipeline);
    for (const item of batch) byId.set(item.id, item);
  }
  return [...byId.values()].sort((a, b) => b.downloads - a.downloads);
}

export function alreadyInCatalog(
  item: HfListing,
  keys: Set<string>,
): boolean {
  const id = compactId(item.id);
  const repo = compactId(item.name);
  if (keys.has(id) || keys.has(repo)) return true;
  for (const k of keys) {
    if (k.length >= 6 && (k.includes(repo) || repo.includes(k))) return true;
  }
  return false;
}
