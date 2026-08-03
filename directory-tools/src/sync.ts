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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(facts.name)} — ModelFacts Directory</title>
  <meta name="description" content="ModelFacts label for ${escapeHtml(facts.name)} by ${escapeHtml(facts.developer)}." />
  <link rel="canonical" href="https://modelfacts.dev${entry.href}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Sora:wght@500;700;800&display=swap" rel="stylesheet" />
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
    <div class="links-row">
      ${facts.homepage ? `<a href="${escapeHtml(facts.homepage)}">Homepage</a>` : ""}
      ${facts.weights ? `<a href="${escapeHtml(facts.weights)}">Weights</a>` : ""}
      ${facts.repository ? `<a href="${escapeHtml(facts.repository)}">Repository</a>` : ""}
    </div>

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

const listingShell = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Directory — ModelFacts</title>
  <meta name="description" content="Browse curated ModelFacts labels for top open-weight and closed AI models." />
  <link rel="canonical" href="https://modelfacts.dev/directory/" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Sora:wght@500;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/directory/directory.css" />
</head>
<body>
  <header class="top">
    <div class="wrap bar">
      <a class="brand-link" href="/">Model<span>Facts</span></a>
      <nav>
        <a href="/directory/" aria-current="page">Directory</a>
        <a href="https://github.com/Catalyst-Forge-LLC/model-facts/blob/main/DIRECTORY_SPEC.md">Spec</a>
        <a href="/schema/model-facts.schema.json">Schema</a>
      </nav>
    </div>
  </header>

  <main class="wrap listing">
    <h1>Directory</h1>
    <p class="lede">Curated ModelFacts labels for well-known models. Open weights and closed APIs side by side — including when the answer is <code>undisclosed</code>.</p>

    <div class="controls">
      <div class="chips" role="group" aria-label="Filter by weight access">
        <button type="button" data-filter="all" class="chip active">All</button>
        <button type="button" data-filter="open" class="chip">Open</button>
        <button type="button" data-filter="closed" class="chip">Closed</button>
      </div>
      <label class="search">
        <span class="sr-only">Filter models</span>
        <input type="search" id="q" placeholder="Filter by name or developer…" autocomplete="off" />
      </label>
    </div>

    <p class="count" id="count"></p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Developer</th>
            <th>Params</th>
            <th>Context</th>
            <th>Filter</th>
            <th>Access</th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
  </main>

  <footer>
    <div class="wrap row">
      <div>© 2026 ModelFacts · <a href="https://www.catalystforge.com/">Catalyst Forge</a></div>
      <div><a href="/">Home</a> · <a href="https://github.com/Catalyst-Forge-LLC/model-facts">GitHub</a></div>
    </div>
  </footer>

  <script src="/directory/listing.js"></script>
</body>
</html>
`;

const listingJs = `async function main() {
  const res = await fetch("/directory/index.json");
  const catalog = await res.json();
  const rowsEl = document.getElementById("rows");
  const countEl = document.getElementById("count");
  const qEl = document.getElementById("q");
  let access = "all";

  function render() {
    const q = (qEl.value || "").trim().toLowerCase();
    const models = catalog.models.filter((m) => {
      if (access !== "all" && m.weight_access !== access) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.developer.toLowerCase().includes(q) ||
        m.slug.includes(q)
      );
    });
    countEl.textContent = models.length + " of " + catalog.count + " models";
    rowsEl.innerHTML = models
      .map(
        (m) =>
          "<tr data-access=\\"" +
          m.weight_access +
          '\\"><td><a href="' +
          m.href +
          '">' +
          escapeHtml(m.name) +
          '</a></td><td>' +
          escapeHtml(m.developer) +
          "</td><td>" +
          escapeHtml(m.parameters) +
          "</td><td>" +
          escapeHtml(m.context_window) +
          '</td><td>' +
          escapeHtml(m.filter_type) +
          '</td><td><span class="badge ' +
          m.weight_access +
          '">' +
          m.weight_access +
          "</span></td></tr>",
      )
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      access = btn.getAttribute("data-filter") || "all";
      render();
    });
  });
  qEl.addEventListener("input", render);
  render();
}
main();
`;

const directoryCss = `:root {
  --ink: #101418;
  --paper: #f8fafc;
  --mute: #9aa8b8;
  --accent: #7c5cf0;
  --accent-soft: #ab93f5;
  --font-display: "Sora", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --max: 68rem;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  color: var(--paper);
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(124, 92, 240, 0.18), transparent 55%),
    radial-gradient(900px 500px at 90% 0%, rgba(80, 120, 160, 0.14), transparent 50%),
    linear-gradient(180deg, #0c1015 0%, var(--ink) 40%, #0a0e13 100%);
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.55;
  min-height: 100vh;
}
a { color: var(--accent-soft); text-underline-offset: 0.18em; }
a:hover { color: #fff; }
.wrap { width: min(100% - 2rem, var(--max)); margin-inline: auto; }
.top { border-bottom: 1px solid rgba(255,255,255,0.08); }
.bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 0; gap: 1rem; flex-wrap: wrap;
}
.brand-link {
  font-family: var(--font-display); font-weight: 800; font-size: 1.25rem;
  letter-spacing: -0.03em; color: #fff; text-decoration: none;
}
.brand-link span { color: var(--accent); }
nav { display: flex; gap: 1rem; flex-wrap: wrap; }
nav a { text-decoration: none; font-weight: 600; font-size: 0.85rem; }
.listing, .detail { padding: 2.25rem 0 3rem; }
h1 {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(2rem, 5vw, 2.75rem); letter-spacing: -0.04em;
  margin: 0 0 0.75rem; color: #fff;
}
.lede { color: var(--mute); max-width: 54ch; margin: 0 0 1.5rem; }
.controls {
  display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;
  align-items: center; margin-bottom: 0.75rem;
}
.chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip {
  background: transparent; border: 1px solid rgba(255,255,255,0.22);
  color: var(--paper); font: 600 0.8rem/1 var(--font-mono);
  padding: 0.5rem 0.75rem; cursor: pointer;
}
.chip.active, .chip:hover { border-color: var(--accent); color: #fff; }
.search input {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.16);
  color: #fff; font: 400 0.85rem/1.2 var(--font-mono); padding: 0.55rem 0.7rem;
  min-width: min(100%, 18rem);
}
.count { color: var(--mute); font-size: 0.8rem; margin: 0 0 0.75rem; }
.table-wrap { overflow-x: auto; border-top: 1px solid rgba(255,255,255,0.1); }
table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
th, td { text-align: left; padding: 0.7rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
th { color: var(--mute); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; font-size: 0.7rem; }
td a { font-weight: 600; text-decoration: none; color: #fff; }
td a:hover { color: var(--accent-soft); }
.badge {
  display: inline-block; padding: 0.15rem 0.4rem; font-size: 0.7rem; font-weight: 600;
  border: 1px solid rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.04em;
}
.badge.open { border-color: rgba(47, 111, 78, 0.7); color: #8fd6b0; }
.badge.closed { border-color: rgba(171, 147, 245, 0.55); color: var(--accent-soft); }
.badge.reviewed { border-color: rgba(255,255,255,0.25); color: #d5dde6; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); border: 0;
}
.crumb { color: var(--mute); font-size: 0.8rem; margin: 0 0 0.75rem; }
.meta-line { display: flex; flex-wrap: wrap; gap: 0.5rem 0.75rem; align-items: center; color: #c9d3de; }
.links-row { display: flex; flex-wrap: wrap; gap: 0.85rem; margin: 1rem 0 1.5rem; }
.label-plane {
  background: var(--paper); color: var(--ink); border-top: 4px solid var(--ink);
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}
.label-plane-inner { padding: 1.1rem 1.15rem 1.35rem; }
.label-plane h2 {
  font-family: var(--font-display); font-weight: 800; font-size: clamp(1.4rem, 3vw, 1.9rem);
  letter-spacing: -0.03em; margin: 0; text-transform: uppercase;
}
.serving {
  font-size: 0.75rem; border-bottom: 10px solid var(--ink);
  padding: 0.4rem 0 0.5rem; margin-bottom: 0.35rem;
}
.label-cols { display: grid; gap: 0.15rem 2rem; }
@media (min-width: 720px) { .label-cols { grid-template-columns: 1fr 1fr; } }
.label-plane .row {
  display: flex; justify-content: space-between; gap: 1rem;
  border-bottom: 1px solid var(--ink); padding: 0.32rem 0; font-size: 0.8rem;
}
.label-plane .row.thick { border-bottom-width: 5px; }
.label-plane .row em { color: #44505c; font-style: normal; font-size: 0.72rem; }
.label-plane .deps {
  grid-column: 1 / -1; margin-top: 0.5rem; font-size: 0.8rem; font-weight: 600;
}
.footnote { color: var(--mute); font-size: 0.78rem; max-width: 62ch; margin: 1.5rem 0 0; }
footer {
  padding: 2rem 0 2.75rem; border-top: 1px solid rgba(255,255,255,0.08);
  color: var(--mute); font-size: 0.8rem;
}
footer .row {
  display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem;
  justify-content: space-between; align-items: center;
}
`;

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
    context_window: facts.architecture.context_window,
    release_date: facts.release_date,
    filter_type: facts.safety.filter_type,
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
writeFileSync(resolve(siteDir, "index.html"), listingShell, "utf8");
writeFileSync(resolve(siteDir, "listing.js"), listingJs, "utf8");
writeFileSync(resolve(siteDir, "directory.css"), directoryCss, "utf8");

if (failed) {
  console.error("Sync finished with errors.");
  process.exit(1);
}
console.log(`Synced ${entries.length} models → site/directory/`);
