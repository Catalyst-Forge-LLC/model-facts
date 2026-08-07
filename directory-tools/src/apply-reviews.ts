#!/usr/bin/env tsx
/**
 * Write the curated directory seed labels from seed-catalog.ts.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { seedCatalog } from "./seed-catalog.js";
import type { Manifest } from "./types.js";
import { writeModelFacts } from "./write-facts.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const manifestPath = resolve(root, "directory/manifest.json");
const schemaPath = resolve(root, "site/schema/model-facts.schema.json");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
let failed = false;

for (const entry of manifest.models) {
  const facts = seedCatalog[entry.slug];
  if (!facts) {
    console.error(`✗ ${entry.slug} — missing seedCatalog entry`);
    failed = true;
    continue;
  }
  if (!validate(facts)) {
    console.error(`✗ ${entry.slug} — schema validation failed:`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
    failed = true;
    continue;
  }
  const outPath = resolve(root, `directory/${entry.slug}/MODEL_FACTS.md`);
  writeModelFacts(outPath, facts);
  console.log(`✓ ${entry.slug}`);
}

process.exit(failed ? 1 : 0);
