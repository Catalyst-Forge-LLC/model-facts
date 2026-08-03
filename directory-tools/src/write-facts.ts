import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { stringify as yamlStringify } from "yaml";
import { renderBody } from "./render.js";
import type { ModelFacts } from "./types.js";

function prune<T>(value: T): T {
  if (Array.isArray(value)) return value.map(prune) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== undefined) out[k] = prune(v);
    }
    return out as T;
  }
  return value;
}

export function writeModelFacts(path: string, facts: ModelFacts): void {
  const cleaned = prune(facts);
  cleaned.model_facts_version = String(cleaned.model_facts_version);
  const frontmatter = yamlStringify(cleaned, { lineWidth: 0 }).trimEnd();
  const output = `---\n${frontmatter}\n---\n\n${renderBody(cleaned)}`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, output, "utf8");
}
