#!/usr/bin/env tsx
/**
 * Rescrape Ollama (and optionally probe Hugging Face) for directory membership.
 *
 * Usage:
 *   pnpm refresh              # update pull counts + write directory/refresh-report.json
 *   pnpm refresh --apply-new  # also add qualifying new families as draft labels
 *
 * Does not overwrite reviewed seed-catalog overlays. Safe for weekly cron.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import {
  draftFactsFromListing,
  representativeOllamaId,
  slugForLibrary,
} from "./draft-from-listing.js";
import {
  fetchLibrary,
  fetchSearchPages,
  libraryName,
  type OllamaListing,
  parsePulls,
  withinMonths,
} from "./ollama-library.js";
import type { Manifest, ManifestModel } from "./types.js";
import { writeModelFacts } from "./write-facts.js";

const MIN_PULLS = 250_000;
const MAX_AGE_MONTHS = 6;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const manifestPath = resolve(root, "directory/manifest.json");
const reportPath = resolve(root, "directory/refresh-report.json");
const schemaPath = resolve(root, "site/schema/model-facts.schema.json");

const applyNew = process.argv.includes("--apply-new");

interface HfHit {
  id: string;
  downloads?: number;
}

async function suggestHf(name: string): Promise<string | null> {
  const url = `https://huggingface.co/api/models?search=${encodeURIComponent(name)}&limit=5&sort=downloads`;
  const res = await fetch(url, { headers: { accept: "application/json" } }).catch(() => null);
  if (!res?.ok) return null;
  const rows = (await res.json()) as HfHit[];
  const needle = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hit = rows.find((r) => r.id.toLowerCase().replace(/[^a-z0-9]/g, "").includes(needle));
  return hit?.id ?? rows[0]?.id ?? null;
}

async function main() {
  console.log("Refreshing Ollama library listings (popular + newest)…");
  const [popular, newest] = await Promise.all([
    fetchSearchPages("popular"),
    fetchSearchPages("newest"),
  ]);
  const byName = new Map<string, OllamaListing>();
  for (const item of [...popular, ...newest]) byName.set(item.name, item);

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const updatedPulls: Array<{ slug: string; from?: string; to: string }> = [];
  const missingFromSearch: string[] = [];

  for (const m of manifest.models) {
    if (m.source.type !== "ollama") continue;
    const lib = libraryName(m.source.id);
    let listing = byName.get(lib);
    if (!listing) {
      try {
        listing = await fetchLibrary(lib);
        byName.set(lib, listing);
        missingFromSearch.push(m.slug);
      } catch (err) {
        console.warn(`  ! ${m.slug} — could not fetch /library/${lib}: ${err}`);
        continue;
      }
    }
    if (listing.pulls && listing.pulls !== m.ollama_pulls) {
      updatedPulls.push({ slug: m.slug, from: m.ollama_pulls, to: listing.pulls });
      m.ollama_pulls = listing.pulls;
    }
    if (listing.updated_iso) m.ollama_updated = listing.updated_iso.slice(0, 10);
  }

  const catalogLibs = new Set(
    manifest.models.flatMap((m) =>
      m.source.type === "ollama" ? [libraryName(m.source.id)] : [],
    ),
  );

  const qualifying = [...byName.values()].filter(
    (item) => item.pulls_n >= MIN_PULLS && withinMonths(item.updated_iso, MAX_AGE_MONTHS),
  );

  const newCandidates = qualifying.filter((item) => !catalogLibs.has(item.name));
  const staleInCatalog = manifest.models.filter((m) => {
    if (m.source.type !== "ollama") return false;
    const listing = byName.get(libraryName(m.source.id));
    if (!listing) return false;
    return listing.pulls_n < MIN_PULLS || !withinMonths(listing.updated_iso, MAX_AGE_MONTHS);
  });

  const hfSuggestions: Array<{ library: string; hf_id: string | null }> = [];
  for (const item of newCandidates) {
    const hf = await suggestHf(item.name);
    hfSuggestions.push({ library: item.name, hf_id: hf });
  }
  for (const m of manifest.models) {
    if (m.source.type !== "huggingface") continue;
    const res = await fetch(`https://huggingface.co/api/models/${m.source.id}`, {
      headers: { accept: "application/json" },
    }).catch(() => null);
    hfSuggestions.push({
      library: m.slug,
      hf_id: res?.ok ? m.source.id : `${m.source.id} (lookup failed)`,
    });
  }

  const applied: string[] = [];
  if (applyNew && newCandidates.length > 0) {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    for (const item of newCandidates) {
      const facts = draftFactsFromListing(item);
      const slug = slugForLibrary(item.name);
      if (manifest.models.some((m) => m.slug === slug)) {
        console.warn(`  skip ${item.name} — slug ${slug} already exists`);
        continue;
      }
      if (!validate(facts)) {
        console.error(`  skip ${item.name} — draft failed schema`);
        continue;
      }
      const outPath = resolve(root, `directory/${slug}/MODEL_FACTS.md`);
      if (existsSync(outPath)) {
        console.warn(`  skip ${slug} — MODEL_FACTS.md already exists`);
        continue;
      }
      writeModelFacts(outPath, facts);
      const row: ManifestModel = {
        slug,
        weight_access: "open",
        curation: "draft",
        source: { type: "ollama", id: representativeOllamaId(item) },
        ollama_pulls: item.pulls,
        ollama_updated: item.updated_iso?.slice(0, 10),
      };
      manifest.models.push(row);
      applied.push(slug);
      console.log(`+ draft ${slug} (${item.pulls} pulls)`);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  manifest.last_refreshed = today;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const report = {
    generated: today,
    criteria: { min_pulls: MIN_PULLS, max_age_months: MAX_AGE_MONTHS },
    listed: byName.size,
    updated_pulls: updatedPulls,
    missing_from_search: missingFromSearch,
    new_candidates: newCandidates.map((c) => ({
      name: c.name,
      pulls: c.pulls,
      pulls_n: c.pulls_n,
      updated: c.updated,
      updated_iso: c.updated_iso,
      sizes: c.sizes,
      url: c.url,
      suggested_slug: slugForLibrary(c.name),
    })),
    stale_in_catalog: staleInCatalog.map((m) => ({
      slug: m.slug,
      pulls: m.ollama_pulls,
      pulls_n: parsePulls(m.ollama_pulls ?? "0"),
    })),
    hf_suggestions: hfSuggestions,
    applied_drafts: applied,
    apply_new: applyNew,
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`Updated pull counts: ${updatedPulls.length}`);
  console.log(`New candidates (≥${MIN_PULLS / 1000}K, ${MAX_AGE_MONTHS}mo): ${newCandidates.length}`);
  for (const c of newCandidates) console.log(`  • ${c.name}  ${c.pulls}  ${c.updated}`);
  if (staleInCatalog.length) {
    console.log(`Below threshold / stale (still in catalog): ${staleInCatalog.length}`);
    for (const m of staleInCatalog) console.log(`  • ${m.slug}  ${m.ollama_pulls ?? "?"}`);
  }
  if (applyNew) console.log(`Drafts added: ${applied.length || "none"}`);
  else if (newCandidates.length) console.log("Re-run with --apply-new to add drafts (reviewed labels stay put).");
  console.log(`Wrote ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
