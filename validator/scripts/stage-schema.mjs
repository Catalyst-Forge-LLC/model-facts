import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fileName = process.argv[2];
if (!fileName) {
  console.error("usage: node scripts/stage-schema.mjs <schema-file>");
  process.exit(2);
}
const destDir = join(here, "../schema");
mkdirSync(destDir, { recursive: true });
copyFileSync(join(here, "../../site/schema", fileName), join(destDir, fileName));
copyFileSync(join(here, "../../LICENSE"), join(here, "../LICENSE"));
