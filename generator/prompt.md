# ModelFacts curation prompt

You are filling in the judgment-and-provenance portion of a **ModelFacts label** — a
"Nutrition Facts" label for AI models (modelfacts.dev). You are given deterministic facts
already extracted from the model's metadata, plus the model card text.

**Intended constraint, not a guarantee:** report only what the card or metadata states,
or what published benchmark numbers on that card support. Do not invent numbers, dates,
or percentages. When a fact is not disclosed, use the string `"undisclosed"`. A later
schema check only proves the JSON is well-formed.

Return **ONLY** a JSON object with this exact shape (omit any key you cannot support with
evidence, except the required enums, which must be a conservative reading of the card
and should be treated as assessments):

```json
{
  "training": {
    "knowledge_cutoff": "YYYY-MM or undisclosed",
    "methodology": "e.g. pre-training -> SFT -> DPO, or undisclosed",
    "tokens": "e.g. 15T (only if stated)",
    "data_composition": [
      { "component": "general web", "percent": "undisclosed", "source_type": "scraped/licensed text", "purpose": "general knowledge" }
    ]
  },
  "capabilities": {
    "natural_language": "full | limited",
    "reasoning_math": "high | medium | low",
    "coding": "high | medium | low",
    "tool_use": "native | prompted | none",
    "languages": "one line, e.g. '29 languages officially supported' (only if stated)",
    "notes": "one line of objective nuance (only if stated)"
  },
  "safety": {
    "refusal_sensitivity": "low | medium | high",
    "instruction_following": "high | medium | low",
    "filter_type": "raw | censored | hybrid",
    "hallucination_benchmark": { "name": "TruthfulQA", "score": 0.6 }
  },
  "benchmarks": [
    { "name": "MMLU", "score": 83.6, "notes": "5-shot" }
  ]
}
```

Guidance:

- `data_composition`: max 8 rows, only components the card actually describes; `percent`
  is a number 0–100 only when the card publishes the mix, else `"undisclosed"`.
- Capability and safety levels are assessments, not measurements. Ground them in the
  card's benchmark table when it exists (for example GSM8K above 85 with multi-step
  reasoning claims can support `reasoning_math: high`). Be conservative when evidence
  is thin, and put the basis in `capabilities.notes`.
- `filter_type`: `raw` = no safety tuning (base/uncensored models), `censored` = heavily
  safety-tuned, `hybrid` = standard aligned instruct model.
- `benchmarks`: max 10, copied exactly from the card. Include shot count, metric, and
  the evaluated variant in `notes`. Omit a score you cannot copy. Do not invent one.
- Do not restate architecture facts (parameters, context, quantization). Those are
  handled deterministically.
- A human will review this draft. Prefer `undisclosed` or omission over a confident guess.
