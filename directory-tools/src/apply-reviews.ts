#!/usr/bin/env tsx
/**
 * Apply human-reviewed overlays to directory labels and write closed-model seeds.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { parse as parseYaml } from "yaml";
import { closedFacts, deepMerge, markReviewed, openPatches } from "./reviews.js";
import type { Manifest, ModelFacts } from "./types.js";
import { writeModelFacts } from "./write-facts.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const manifestPath = resolve(root, "directory/manifest.json");
const schemaPath = resolve(root, "site/schema/model-facts.schema.json");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

function extractFrontmatter(markdown: string): string | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(markdown);
  return match ? match[1] : null;
}

function loadFacts(path: string): ModelFacts {
  const text = readFileSync(path, "utf8");
  const fm = extractFrontmatter(text);
  if (!fm) throw new Error(`No frontmatter in ${path}`);
  return parseYaml(fm) as ModelFacts;
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
let failed = false;

for (const entry of manifest.models) {
  const outPath = resolve(root, `directory/${entry.slug}/MODEL_FACTS.md`);
  let facts: ModelFacts;

  if (entry.source.type === "hand") {
    const seed = closedFacts[entry.slug];
    if (!seed) {
      console.error(`✗ ${entry.slug} — missing closedFacts entry`);
      failed = true;
      continue;
    }
    facts = markReviewed(seed);
  } else {
    if (!existsSync(outPath)) {
      console.error(`✗ ${entry.slug} — missing generator draft (run seed first)`);
      failed = true;
      continue;
    }
    const base = loadFacts(outPath);
    const patch = openPatches[entry.slug] ?? {};
    facts = markReviewed(deepMerge(base as unknown as Record<string, unknown>, patch as never) as unknown as ModelFacts);
  }

  if (!validate(facts)) {
    console.error(`✗ ${entry.slug} — schema validation failed:`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
    failed = true;
    continue;
  }

  writeModelFacts(outPath, facts);
  console.log(`✓ ${entry.slug}`);
}

process.exit(failed ? 1 : 0);
