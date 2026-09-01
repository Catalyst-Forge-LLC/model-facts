#!/usr/bin/env tsx
/**
 * Rescrape Ollama + Hugging Face Hub for directory membership.
 *
 * Usage:
 *   pnpm refresh              # update counts + write directory/refresh-report.json
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
  draftFactsFromHf,
  draftFactsFromListing,
  representativeOllamaId,
  slugForHfId,
  slugForLibrary,
} from "./draft-from-listing.js";
import {
  alreadyInCatalog,
  compactId,
  fetchHfListings,
  hfFamilyKey,
  type HfListing,
} from "./hf-library.js";
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
const MIN_HF_DOWNLOADS = 250_000;
const MAX_AGE_MONTHS = 6;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const manifestPath = resolve(root, "directory/manifest.json");
const reportPath = resolve(root, "directory/refresh-report.json");
const schemaPath = resolve(root, "site/schema/model-facts.schema.json");

const applyNew = process.argv.includes("--apply-new");

function catalogKeys(manifest: Manifest): Set<string> {
  const keys = new Set<string>();
  for (const m of manifest.models) {
    keys.add(compactId(m.slug));
    if (m.source.type === "ollama") keys.add(compactId(libraryName(m.source.id)));
    if (m.source.type === "huggingface") keys.add(compactId(m.source.id));
  }
  return keys;
}

function onePerFamily(items: HfListing[]): HfListing[] {
  const best = new Map<string, HfListing>();
  for (const item of items) {
    const key = hfFamilyKey(item.id) || compactId(item.id);
    const prev = best.get(key);
    if (!prev || item.downloads > prev.downloads) best.set(key, item);
  }
  return [...best.values()].sort((a, b) => b.downloads - a.downloads);
}

async function main() {
  console.log("Refreshing Ollama library listings (popular + newest)…");
  const [popular, newest] = await Promise.all([
    fetchSearchPages("popular"),
    fetchSearchPages("newest"),
  ]);
  const byName = new Map<string, OllamaListing>();
  for (const item of [...popular, ...newest]) byName.set(item.name, item);

  console.log("Refreshing Hugging Face Hub (text / vision / any-to-any by downloads)…");
  const hfListed = await fetchHfListings();

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const updatedPulls: Array<{ slug: string; from?: string; to: string }> = [];
  const updatedHf: Array<{ slug: string; from?: number; to: number }> = [];
  const missingFromSearch: string[] = [];

  for (const m of manifest.models) {
    if (m.source.type === "ollama") {
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
    if (m.source.type === "huggingface") {
      const hfId = m.source.id;
      const hit = hfListed.find((h) => h.id === hfId);
      if (hit) {
        if (hit.downloads !== m.hf_downloads) {
          updatedHf.push({ slug: m.slug, from: m.hf_downloads, to: hit.downloads });
          m.hf_downloads = hit.downloads;
        }
        if (hit.last_modified) m.hf_updated = hit.last_modified.slice(0, 10);
      }
    }
  }

  const catalogLibs = new Set(
    manifest.models.flatMap((m) =>
      m.source.type === "ollama" ? [libraryName(m.source.id)] : [],
    ),
  );

  const qualifyingOllama = [...byName.values()].filter(
    (item) => item.pulls_n >= MIN_PULLS && withinMonths(item.updated_iso, MAX_AGE_MONTHS),
  );
  const newOllama = qualifyingOllama.filter((item) => !catalogLibs.has(item.name));
  const staleInCatalog = manifest.models.filter((m) => {
    if (m.source.type !== "ollama") return false;
    const listing = byName.get(libraryName(m.source.id));
    if (!listing) return false;
    return listing.pulls_n < MIN_PULLS || !withinMonths(listing.updated_iso, MAX_AGE_MONTHS);
  });

  const keys = catalogKeys(manifest);
  const qualifyingHf = hfListed.filter(
    (item) => item.downloads >= MIN_HF_DOWNLOADS && withinMonths(item.last_modified, MAX_AGE_MONTHS),
  );
  const newHf = onePerFamily(qualifyingHf.filter((item) => !alreadyInCatalog(item, keys)));

  const applied: string[] = [];
  if (applyNew) {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    for (const item of newOllama) {
      const facts = draftFactsFromListing(item);
      const slug = slugForLibrary(item.name);
      if (manifest.models.some((m) => m.slug === slug) || existsSync(resolve(root, `directory/${slug}/MODEL_FACTS.md`))) {
        console.warn(`  skip ${item.name} — slug ${slug} already exists`);
        continue;
      }
      if (!validate(facts)) {
        console.error(`  skip ${item.name} — draft failed schema`);
        continue;
      }
      writeModelFacts(resolve(root, `directory/${slug}/MODEL_FACTS.md`), facts);
      const row: ManifestModel = {
        slug,
        weight_access: "open",
        curation: "draft",
        source: { type: "ollama", id: representativeOllamaId(item) },
        ollama_pulls: item.pulls,
        ollama_updated: item.updated_iso?.slice(0, 10),
      };
      manifest.models.push(row);
      keys.add(compactId(slug));
      keys.add(compactId(item.name));
      applied.push(slug);
      console.log(`+ draft ${slug} (Ollama ${item.pulls})`);
    }

    for (const item of newHf) {
      if (alreadyInCatalog(item, keys)) continue;
      const facts = draftFactsFromHf(item);
      const slug = slugForHfId(item.id);
      if (manifest.models.some((m) => m.slug === slug) || existsSync(resolve(root, `directory/${slug}/MODEL_FACTS.md`))) {
        console.warn(`  skip ${item.id} — slug ${slug} already exists`);
        continue;
      }
      if (!validate(facts)) {
        console.error(`  skip ${item.id} — draft failed schema`);
        continue;
      }
      writeModelFacts(resolve(root, `directory/${slug}/MODEL_FACTS.md`), facts);
      const row: ManifestModel = {
        slug,
        weight_access: "open",
        curation: "draft",
        source: { type: "huggingface", id: item.id },
        hf_downloads: item.downloads,
        hf_updated: item.last_modified?.slice(0, 10),
      };
      manifest.models.push(row);
      keys.add(compactId(slug));
      keys.add(compactId(item.id));
      applied.push(slug);
      console.log(`+ draft ${slug} (HF ${item.downloads.toLocaleString()} dl)`);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  manifest.last_refreshed = today;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const report = {
    generated: today,
    criteria: {
      min_ollama_pulls: MIN_PULLS,
      min_hf_downloads: MIN_HF_DOWNLOADS,
      max_age_months: MAX_AGE_MONTHS,
    },
    ollama_listed: byName.size,
    hf_listed: hfListed.length,
    updated_pulls: updatedPulls,
    updated_hf_downloads: updatedHf,
    missing_from_search: missingFromSearch,
    new_candidates: newOllama.map((c) => ({
      source: "ollama",
      name: c.name,
      pulls: c.pulls,
      pulls_n: c.pulls_n,
      updated: c.updated,
      updated_iso: c.updated_iso,
      sizes: c.sizes,
      url: c.url,
      suggested_slug: slugForLibrary(c.name),
    })),
    new_hf_candidates: newHf.map((c) => ({
      source: "huggingface",
      id: c.id,
      downloads: c.downloads,
      last_modified: c.last_modified,
      pipeline_tag: c.pipeline_tag,
      gated: c.gated,
      url: c.url,
      suggested_slug: slugForHfId(c.id),
    })),
    stale_in_catalog: staleInCatalog.map((m) => ({
      slug: m.slug,
      pulls: m.ollama_pulls,
      pulls_n: parsePulls(m.ollama_pulls ?? "0"),
    })),
    applied_drafts: applied,
    apply_new: applyNew,
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`Updated Ollama pull counts: ${updatedPulls.length}`);
  console.log(`New Ollama candidates (≥${MIN_PULLS / 1000}K, ${MAX_AGE_MONTHS}mo): ${newOllama.length}`);
  for (const c of newOllama) console.log(`  • ${c.name}  ${c.pulls}  ${c.updated}`);
  console.log(`New HF-only candidates (≥${MIN_HF_DOWNLOADS / 1000}K dl, ${MAX_AGE_MONTHS}mo, one/family): ${newHf.length}`);
  for (const c of newHf) {
    console.log(`  • ${c.id}  ${c.downloads.toLocaleString()} dl  ${c.last_modified?.slice(0, 10) ?? "?"}`);
  }
  if (staleInCatalog.length) {
    console.log(`Below threshold / stale (still in catalog): ${staleInCatalog.length}`);
    for (const m of staleInCatalog) console.log(`  • ${m.slug}  ${m.ollama_pulls ?? "?"}`);
  }
  if (applyNew) console.log(`Drafts added: ${applied.length || "none"}`);
  else if (newOllama.length || newHf.length) {
    console.log("Re-run with --apply-new to add drafts (reviewed labels stay put).");
  }
  console.log(`Wrote ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
