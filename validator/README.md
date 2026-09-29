# ModelFacts validator

A tiny CLI that checks the YAML frontmatter of a `MODEL_FACTS.md` file against the
canonical JSON Schema ([`site/schema/model-facts.schema.json`](../site/schema/model-facts.schema.json),
served at [modelfacts.dev/schema/model-facts.schema.json](https://modelfacts.dev/schema/model-facts.schema.json)).

The command is `modelfacts validate <file>` from `@xfacts/modelfacts` (Node 22.18 or newer). In this repository, `pnpm validate` runs the same program.

## Usage

```bash
cd validator
pnpm install

# validate one or more files (exit code 1 on any failure — CI-friendly)
pnpm validate ../examples/MODEL_FACTS.md
pnpm validate path/to/your/MODEL_FACTS.md
```

TypeScript, ESM. Node runs the source directly. Uses [ajv](https://ajv.js.org/) (draft-07) with
`ajv-formats` and [yaml](https://eemeli.org/yaml/).
