#!/usr/bin/env tsx
/**
 * Validate directory labels and regenerate the static site mirror under site/directory/.
 */
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { parse as parseYaml } from "yaml";
import type { Catalog, CatalogEntry, Manifest, ModelFacts } from "./types.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const manifestPath = resolve(root, "directory/manifest.json");
const schemaPath = resolve(root, "site/schema/model-facts.schema.json");
const siteDir = resolve(root, "site/directory");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

function extractFrontmatter(markdown: string): string | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(markdown);
  return match ? match[1] : null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Parse "70B", "7.62B", "8x22B", "1.6T" → billions; undisclosed → null. */
export function parseParametersB(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  if (!s || s === "undisclosed") return null;
  const moe = /^(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*b$/.exec(s);
  if (moe) return Number(moe[1]) * Number(moe[2]);
  const withUnit = /^(\d+(?:\.\d+)?)\s*([bt])$/.exec(s);
  if (withUnit) {
    const n = Number(withUnit[1]);
    return withUnit[2] === "t" ? n * 1000 : n;
  }
  return null;
}

/** Parse "128k", "1M", "8000" → tokens; undisclosed → null. */
export function parseContextTokens(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  if (!s || s === "undisclosed") return null;
  const m = /^(\d+(?:\.\d+)?)\s*([kmb])?$/.exec(s);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2];
  if (unit === "k") return Math.round(n * 1_000);
  if (unit === "m") return Math.round(n * 1_000_000);
  if (unit === "b") return Math.round(n * 1_000_000_000);
  return Math.round(n);
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    const display = `${u.host}${path}`;
    return display.length > 42 ? `${display.slice(0, 39)}…` : display;
  } catch {
    return url.length > 42 ? `${url.slice(0, 39)}…` : url;
  }
}

function linkRow(label: string, url: string | undefined): string {
  if (!url) return "";
  return `<div class="row"><strong>${escapeHtml(label)}</strong><span><a class="label-link" href="${escapeHtml(url)}" rel="noopener">${escapeHtml(shortUrl(url))}</a></span></div>`;
}

function detailHtml(entry: CatalogEntry, facts: ModelFacts): string {
  const a = facts.architecture;
  const t = facts.training;
  const c = facts.capabilities;
  const s = facts.safety;
  const modalities =
    a.modalities_in && a.modalities_out
      ? `${a.modalities_in.join(" + ")} → ${a.modalities_out.join(" + ")}`
      : "—";
  const benchmarks = (facts.benchmarks ?? [])
    .map((b) => `<div class="row"><strong>${escapeHtml(b.name)}</strong><span>${escapeHtml(String(b.score))}${b.notes ? ` <em>${escapeHtml(b.notes)}</em>` : ""}</span></div>`)
    .join("\n");
  const sourceLinks = [
    linkRow("Homepage", facts.homepage),
    linkRow("Weights", facts.weights),
    linkRow("Repository", facts.repository),
  ]
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(facts.name)} — ModelFacts Directory</title>
  <meta name="description" content="ModelFacts label for ${escapeHtml(facts.name)} by ${escapeHtml(facts.developer)}." />
  <link rel="canonical" href="https://modelfacts.dev${entry.href}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/fonts/fonts.css" />
  <link rel="stylesheet" href="/directory/directory.css" />
</head>
<body>
  <header class="top">
    <div class="wrap bar">
      <a class="brand-link" href="/">Model<span>Facts</span></a>
      <nav>
        <a href="/directory/">Directory</a>
        <a href="${entry.facts_md}">Raw MD</a>
        <a href="${entry.facts_json}">JSON</a>
      </nav>
    </div>
  </header>

  <main class="wrap detail">
    <p class="crumb"><a href="/directory/">Directory</a> / ${escapeHtml(entry.slug)}</p>
    <h1>${escapeHtml(facts.name)}</h1>
    <p class="meta-line">
      <span class="badge ${entry.weight_access}">${entry.weight_access}</span>
      <span class="badge ${entry.curation}">${entry.curation}</span>
      <span>${escapeHtml(facts.developer)}</span>
      ·
      <span>${escapeHtml(facts.license)}</span>
    </p>

    <div class="label-plane" aria-label="Model Facts label">
      <div class="label-plane-inner">
        <h2>Model Facts</h2>
        <div class="serving">${escapeHtml(facts.name)} · ${escapeHtml(facts.status)}</div>
        <div class="label-cols">
          <div class="row thick"><strong>Architecture</strong><span>${escapeHtml(a.type)}</span></div>
          <div class="row thick"><strong>Parameters</strong><span>${escapeHtml(a.parameters)}${a.active_parameters ? ` (${escapeHtml(a.active_parameters)} active)` : ""}</span></div>
          <div class="row"><strong>Context window</strong><span>${escapeHtml(a.context_window)}</span></div>
          <div class="row"><strong>Quantization</strong><span>${escapeHtml(a.quantization)}</span></div>
          <div class="row"><strong>Modalities</strong><span>${escapeHtml(modalities)}</span></div>
          <div class="row"><strong>Knowledge cutoff</strong><span>${escapeHtml(t.knowledge_cutoff)}</span></div>
          <div class="row"><strong>Methodology</strong><span>${escapeHtml(t.methodology)}</span></div>
          ${t.tokens ? `<div class="row"><strong>Tokens</strong><span>${escapeHtml(t.tokens)}</span></div>` : ""}
          <div class="row thick"><strong>Filter type</strong><span>${escapeHtml(s.filter_type)}</span></div>
          <div class="row"><strong>Refusal</strong><span>${escapeHtml(s.refusal_sensitivity)}</span></div>
          <div class="row"><strong>Instruction following</strong><span>${escapeHtml(s.instruction_following)}</span></div>
          <div class="row"><strong>Reasoning / math</strong><span>${escapeHtml(c.reasoning_math)}</span></div>
          <div class="row"><strong>Coding</strong><span>${escapeHtml(c.coding)}</span></div>
          <div class="row"><strong>Vision</strong><span>${escapeHtml(c.vision_input)}</span></div>
          <div class="row"><strong>Tool use</strong><span>${escapeHtml(c.tool_use ?? "—")}</span></div>
          ${benchmarks ? `<div class="deps"><b>Benchmarks</b></div>${benchmarks}` : ""}
          ${sourceLinks ? `<div class="deps"><b>Sources</b></div>${sourceLinks}` : ""}
        </div>
      </div>
    </div>

    <p class="footnote">
      Judgment fields are reviewed self-reports from published docs — not ModelFacts-run evals.
      See <a href="https://github.com/Catalyst-Forge-LLC/model-facts/blob/main/DIRECTORY_SPEC.md">DIRECTORY_SPEC.md</a>.
    </p>
  </main>

  <footer>
    <div class="wrap row">
      <div>© 2026 ModelFacts · <a href="https://www.catalystforge.com/">Catalyst Forge</a></div>
      <div><a href="/directory/">Directory</a> · <a href="https://github.com/Catalyst-Forge-LLC/model-facts">GitHub</a></div>
    </div>
  </footer>
</body>
</html>
`;
}

const assetsDir = resolve(here, "../assets");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
const today = new Date().toISOString().slice(0, 10);

// Wipe generated model pages but keep hand-authored shell files we rewrite below.
rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });

const entries: CatalogEntry[] = [];
let failed = false;

for (const m of manifest.models) {
  const mdPath = resolve(root, `directory/${m.slug}/MODEL_FACTS.md`);
  let text: string;
  try {
    text = readFileSync(mdPath, "utf8");
  } catch {
    console.error(`✗ ${m.slug} — missing MODEL_FACTS.md`);
    failed = true;
    continue;
  }
  const fm = extractFrontmatter(text);
  if (!fm) {
    console.error(`✗ ${m.slug} — no frontmatter`);
    failed = true;
    continue;
  }
  const facts = parseYaml(fm) as ModelFacts;
  if (!validate(facts)) {
    console.error(`✗ ${m.slug} — schema validation failed`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
    failed = true;
    continue;
  }

  const entry: CatalogEntry = {
    slug: m.slug,
    name: facts.name,
    developer: facts.developer,
    status: facts.status,
    license: facts.license,
    weight_access: m.weight_access,
    curation: m.curation,
    parameters: facts.architecture.parameters,
    parameters_b: parseParametersB(facts.architecture.parameters),
    context_window: facts.architecture.context_window,
    context_tokens: parseContextTokens(facts.architecture.context_window),
    release_date: facts.release_date,
    filter_type: facts.safety.filter_type,
    vision_input: facts.capabilities.vision_input,
    audio_input: facts.capabilities.audio_input,
    tool_use: facts.capabilities.tool_use ?? null,
    reasoning_math: facts.capabilities.reasoning_math,
    coding: facts.capabilities.coding,
    refusal_sensitivity: facts.safety.refusal_sensitivity,
    instruction_following: facts.safety.instruction_following,
    href: `/directory/${m.slug}/`,
    facts_json: `/directory/${m.slug}/facts.json`,
    facts_md: `/directory/${m.slug}/MODEL_FACTS.md`,
  };
  entries.push(entry);

  const out = resolve(siteDir, m.slug);
  mkdirSync(out, { recursive: true });
  writeFileSync(resolve(out, "facts.json"), JSON.stringify(facts, null, 2) + "\n", "utf8");
  copyFileSync(mdPath, resolve(out, "MODEL_FACTS.md"));
  writeFileSync(resolve(out, "index.html"), detailHtml(entry, facts), "utf8");
  console.log(`✓ ${m.slug}`);
}

entries.sort((a, b) => a.name.localeCompare(b.name));

const catalog: Catalog = {
  directory_version: "0.1.0",
  generated: today,
  count: entries.length,
  models: entries,
};

writeFileSync(resolve(siteDir, "index.json"), JSON.stringify(catalog, null, 2) + "\n", "utf8");
copyFileSync(resolve(assetsDir, "listing.html"), resolve(siteDir, "index.html"));
copyFileSync(resolve(assetsDir, "listing.js"), resolve(siteDir, "listing.js"));
copyFileSync(resolve(assetsDir, "directory.css"), resolve(siteDir, "directory.css"));

if (failed) {
  console.error("Sync finished with errors.");
  process.exit(1);
}
console.log(`Synced ${entries.length} models → site/directory/`);
