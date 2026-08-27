/**
 * Scrape the public Ollama library listing (no official registry API).
 * Search is SSR + HTMX pagination; be polite and identify ourselves.
 */
const UA = "ModelFactsDirectory/0.3 (+https://modelfacts.dev; weekly catalog refresh)";
const BASE = "https://ollama.com";

export interface OllamaListing {
  name: string;
  description: string;
  pulls: string;
  pulls_n: number;
  sizes: string[];
  capabilities: string[];
  updated: string;
  updated_iso: string | null;
  url: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchText(url: string, htmx = false): Promise<string> {
  const headers: Record<string, string> = { "user-agent": UA, accept: "text/html" };
  if (htmx) headers["HX-Request"] = "true";
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return await res.text();
}

/** Parse "947.8K", "23.5M", "9,949" → integer. */
export function parsePulls(raw: string): number {
  const s = raw.trim().replace(/,/g, "");
  const m = /^(\d+(?:\.\d+)?)\s*([kmb])?$/i.exec(s);
  if (!m) return 0;
  const n = Number(m[1]);
  const u = (m[2] || "").toLowerCase();
  if (u === "k") return Math.round(n * 1_000);
  if (u === "m") return Math.round(n * 1_000_000);
  if (u === "b") return Math.round(n * 1_000_000_000);
  return Math.round(n);
}

export function parseUpdatedIso(html: string): string | null {
  const titled = /title="([A-Z][a-z]{2} \d{1,2}, \d{4}[^"]*)"/.exec(html);
  if (titled) {
    const d = new Date(titled[1]);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  const rel = />\s*((?:\d+\s+(?:hour|day|week|month|year)s?\s+ago)|yesterday|today)\s*</i.exec(html);
  if (!rel) return null;
  return relativeToIso(rel[1]);
}

export function relativeToIso(raw: string, now = new Date()): string {
  const s = raw.trim().toLowerCase();
  const t = now.getTime();
  if (s === "today") return new Date(t).toISOString();
  if (s === "yesterday") return new Date(t - 86_400_000).toISOString();
  const m = /^(\d+)\s+(hour|day|week|month|year)s?\s+ago$/.exec(s);
  if (!m) return now.toISOString();
  const n = Number(m[1]);
  const unit = m[2];
  const ms =
    unit === "hour"
      ? n * 3_600_000
      : unit === "day"
        ? n * 86_400_000
        : unit === "week"
          ? n * 7 * 86_400_000
          : unit === "month"
            ? n * 30 * 86_400_000
            : n * 365 * 86_400_000;
  return new Date(t - ms).toISOString();
}

export function withinMonths(iso: string | null, months: number, now = new Date()): boolean {
  if (!iso) return false;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return false;
  return now.getTime() - then <= months * 30 * 86_400_000;
}

function parseCard(block: string): OllamaListing | null {
  const href = /href="\/library\/([^"]+)"/.exec(block);
  if (!href) return null;
  const name = href[1];
  const desc = /<p class="max-w-lg[^"]*">([\s\S]*?)<\/p>/.exec(block);
  const pulls = /<span\s*>([^<]+)<\/span>\s*<span class="hidden sm:flex">&nbsp;Pulls<\/span>/.exec(block);
  const updatedRel = /Updated&nbsp;<\/span>\s*<span\s*>([^<]+)<\/span>/.exec(block);
  const sizes = [...block.matchAll(/text-blue-600[^"]*">\s*([0-9.]+[bkm]|e\d+b)\s*</gi)].map((m) =>
    m[1].toLowerCase(),
  );
  const capabilities = ["vision", "tools", "thinking", "audio", "embedding", "cloud"].filter((c) =>
    new RegExp(`>${c}<`, "i").test(block),
  );
  const pullStr = pulls?.[1].trim() ?? "0";
  return {
    name,
    description: (desc?.[1] ?? "").replace(/\s+/g, " ").trim(),
    pulls: pullStr,
    pulls_n: parsePulls(pullStr),
    sizes: [...new Set(sizes)],
    capabilities,
    updated: updatedRel?.[1].trim() ?? "",
    updated_iso: parseUpdatedIso(block),
    url: `${BASE}/library/${name}`,
  };
}

export function parseSearchHtml(html: string): OllamaListing[] {
  const items: OllamaListing[] = [];
  const re = /<li\b[^>]*>[\s\S]*?<\/li>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const card = parseCard(m[0]);
    if (card) items.push(card);
  }
  return items;
}

export async function fetchSearchPages(
  sort: "popular" | "newest",
  maxPages = 12,
): Promise<OllamaListing[]> {
  const seen = new Map<string, OllamaListing>();
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}/search?o=${sort}${page > 1 ? `&page=${page}` : ""}`;
    const html = await fetchText(url, page > 1);
    const batch = parseSearchHtml(html);
    if (batch.length === 0) break;
    for (const item of batch) seen.set(item.name, item);
    await sleep(150);
  }
  return [...seen.values()];
}

export function parseLibraryPage(name: string, html: string): OllamaListing {
  const pulls =
    /<span\s*>([^<]+)<\/span>\s*<span class="hidden sm:flex">&nbsp;(?:Pulls|Downloads)<\/span>/.exec(
      html,
    );
  const updatedRel = /Updated&nbsp;<\/span>\s*<span\s*>([^<]+)<\/span>/.exec(html);
  const desc =
    /id="summary-content">\s*([\s\S]*?)\s*<\/span>/.exec(html)?.[1]?.replace(/\s+/g, " ").trim() ??
    "";
  const pullStr = pulls?.[1].trim() ?? "0";
  const sizes = [...html.matchAll(/text-blue-600[^"]*">\s*([0-9.]+[bkm]|e\d+b)\s*</gi)].map((m) =>
    m[1].toLowerCase(),
  );
  const capabilities = ["vision", "tools", "thinking", "audio", "embedding", "cloud"].filter((c) =>
    new RegExp(`>${c}<`, "i").test(html),
  );
  return {
    name,
    description: desc,
    pulls: pullStr,
    pulls_n: parsePulls(pullStr),
    sizes: [...new Set(sizes)],
    capabilities,
    updated: updatedRel?.[1].trim() ?? "",
    updated_iso: parseUpdatedIso(html),
    url: `${BASE}/library/${name}`,
  };
}

export async function fetchLibrary(name: string): Promise<OllamaListing> {
  const html = await fetchText(`${BASE}/library/${name}`);
  return parseLibraryPage(name, html);
}

/** Library family name from a manifest ollama id (`gemma4:31b` → `gemma4`). */
export function libraryName(ollamaId: string): string {
  return ollamaId.split(":")[0];
}
