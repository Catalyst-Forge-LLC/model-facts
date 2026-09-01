#!/usr/bin/env tsx
/**
 * Weekly directory rebuild: refresh listings → apply reviewed overlays → seed missing HF → sync site.
 *
 *   pnpm rebuild-catalog
 *   pnpm rebuild-catalog --apply-new
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const tools = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const extra = process.argv.slice(2);

function run(script: string, args: string[] = []): void {
  const result = spawnSync("pnpm", [script, ...args], {
    cwd: tools,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("refresh", extra);
run("apply-reviews");
run("seed");
run("sync");
console.log("Rebuild complete.");
