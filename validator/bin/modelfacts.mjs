#!/usr/bin/env node

const usage = `modelfacts

  modelfacts validate <file.md> [more files...]
  modelfacts --help
  modelfacts --version
`;

const [command, ...rest] = process.argv.slice(2);
if (!command || command === "--help" || command === "-h") {
  console.log(usage);
  process.exit(command ? 0 : 2);
}
if (command === "--version" || command === "-v") {
  const { readFileSync } = await import("node:fs");
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  console.log(pkg.version);
  process.exit(0);
}
if (command === "validate") {
  process.argv = [process.argv[0], process.argv[1], ...rest];
  await import("../src/validate.ts");
} else {
  console.error(usage);
  process.exit(2);
}
