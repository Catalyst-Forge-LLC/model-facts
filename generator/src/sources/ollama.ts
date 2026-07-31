/** Ollama source adapter: local /api/show metadata (GGUF header facts). */
import { SourceFacts, Toggle, formatContextWindow, formatParamCount, normalizeLicense } from "../facts.js";

interface OllamaShow {
  license?: string;
  modelfile?: string;
  details?: {
    family?: string;
    parameter_size?: string;
    quantization_level?: string;
    format?: string;
  };
  model_info?: Record<string, unknown>;
  capabilities?: string[];
}

/** Accepts "ollama:name[:tag]". */
export function parseOllamaName(target: string): string {
  return target.replace(/^ollama:/, "");
}

export async function fromOllama(target: string, host = "http://localhost:11434"): Promise<SourceFacts> {
  const name = parseOllamaName(target);
  const res = await fetch(`${host}/api/show`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  }).catch(() => null);
  if (!res || !res.ok) {
    throw new Error(`Ollama did not return model "${name}" (is Ollama running at ${host}?)`);
  }
  const show = (await res.json()) as OllamaShow;

  const mi = show.model_info ?? {};
  const arch = mi["general.architecture"] as string | undefined;
  const contextLen = arch ? (mi[`${arch}.context_length`] as number | undefined) : undefined;
  const paramCount = mi["general.parameter_count"] as number | undefined;
  const expertCount = arch ? (mi[`${arch}.expert_count`] as number | undefined) : undefined;
  const licenseId = mi["general.license"] as string | undefined;
  const baseName = mi["general.base_model.0.name"] as string | undefined;
  const baseOrg = mi["general.base_model.0.organization"] as string | undefined;
  const baseUrl = mi["general.base_model.0.repo_url"] as string | undefined;

  const caps = show.capabilities ?? [];
  const visionInput: Toggle = caps.includes("vision") ? "enabled" : "disabled";
  const audioInput: Toggle = caps.includes("audio") ? "enabled" : "disabled";
  const toolUse = caps.includes("tools") ? ("native" as const) : undefined;

  const quant = show.details?.quantization_level;
  const format = show.details?.format?.toUpperCase() ?? "GGUF";

  // First lines of the license blob often name the license when the id is missing.
  const licenseHead = show.license?.trim().split(/\r?\n/).slice(0, 2).join(" ").trim();

  const architectureType = expertCount && expertCount > 1
    ? `mixture of experts (MoE, ${expertCount} experts)`
    : arch
      ? `dense transformer (decoder-only, ${arch} family)`
      : undefined;

  return {
    name,
    developer: baseOrg,
    license: normalizeLicense(licenseId) !== "UNKNOWN" ? normalizeLicense(licenseId) : licenseHead || "UNKNOWN",
    weights: baseUrl,
    baseModel: baseName,
    architectureType,
    parameters: paramCount
      ? formatParamCount(paramCount)
      : show.details?.parameter_size,
    contextWindow: typeof contextLen === "number" ? formatContextWindow(contextLen) : undefined,
    quantization: quant ? `${format} ${quant}` : format,
    visionInput,
    audioInput,
    toolUse,
    cardText: [
      `Ollama model: ${name}`,
      `Details: ${JSON.stringify(show.details ?? {})}`,
      `Capabilities: ${caps.join(", ") || "unknown"}`,
      `Base model: ${baseName ?? "unknown"} (${baseOrg ?? "unknown"}) ${baseUrl ?? ""}`,
      `Modelfile:\n${(show.modelfile ?? "").slice(0, 2000)}`,
    ].join("\n"),
    sourceLabel: `ollama:${name}`,
  };
}
