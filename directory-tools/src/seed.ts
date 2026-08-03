#!/usr/bin/env tsx
/**
 * Generate missing open-weight directory labels via the ModelFacts generator (deterministic).
 *
 * Usage:
 *   pnpm seed              # all missing huggingface entries
 *   pnpm seed --slug <s>   # one slug
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import type { Manifest } from "./types.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const manifest = JSON.parse(readFileSync(resolve(root, "directory/manifest.json"), "utf8")) as Manifest;

const slugFlag = process.argv.indexOf("--slug");
const only = slugFlag >= 0 ? process.argv[slugFlag + 1] : undefined;

const targets = manifest.models.filter((m) => {
  if (m.source.type !== "huggingface") return false;
  if (only && m.slug !== only) return false;
  const path = resolve(root, `directory/${m.slug}/MODEL_FACTS.md`);
  return !existsSync(path);
});

if (targets.length === 0) {
  console.log(only ? `Nothing to seed for ${only}` : "All huggingface entries already have labels.");
  process.exit(0);
}

const generator = resolve(root, "generator");
let failed = false;

for (const m of targets) {
  if (m.source.type !== "huggingface") continue;
  const outDir = resolve(root, `directory/${m.slug}`);
  mkdirSync(outDir, { recursive: true });
  const out = resolve(outDir, "MODEL_FACTS.md");
  console.log(`Seeding ${m.slug} from ${m.source.id} …`);
  const result = spawnSync(
    "pnpm",
    [
      "generate",
      m.source.id,
      "--output",
      out,
      "--built-by",
      "Catalyst Forge — https://www.catalystforge.com/",
    ],
    { cwd: generator, stdio: "inherit", shell: true },
  );
  if (result.status !== 0) {
    failed = true;
    console.error(`Failed: ${m.slug}`);
  }
}

process.exit(failed ? 1 : 0);
