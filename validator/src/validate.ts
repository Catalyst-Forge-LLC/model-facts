#!/usr/bin/env tsx
/**
 * Validate MODEL_FACTS.md frontmatter against the canonical ModelFacts JSON Schema.
 *
 * Usage:
 *   pnpm validate <path/to/MODEL_FACTS.md> [more files...]
 *
 * Exits non-zero if any file is missing frontmatter or fails schema validation.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, "../../site/schema/model-facts.schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

function extractFrontmatter(markdown: string): string | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(markdown);
  return match ? match[1] : null;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: pnpm validate <path/to/MODEL_FACTS.md> [more files...]");
  process.exit(2);
}

let failed = false;

for (const file of files) {
  const path = resolve(file);
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`✗ ${file} — cannot read file`);
    failed = true;
    continue;
  }

  const frontmatter = extractFrontmatter(text);
  if (frontmatter === null) {
    console.error(`✗ ${file} — no YAML frontmatter found (expected leading --- block)`);
    failed = true;
    continue;
  }

  let data: unknown;
  try {
    data = parseYaml(frontmatter);
  } catch (err) {
    console.error(`✗ ${file} — YAML parse error: ${(err as Error).message}`);
    failed = true;
    continue;
  }

  if (validate(data)) {
    console.log(`✓ ${file} — valid ModelFacts ${String((data as Record<string, unknown>).model_facts_version ?? "")}`.trimEnd());
  } else {
    console.error(`✗ ${file} — schema validation failed:`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
