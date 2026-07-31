# ModelFacts curation prompt

You are filling in the judgment-and-provenance portion of a **ModelFacts label** — a
"Nutrition Facts" label for AI models (modelfacts.dev). You are given deterministic facts
already extracted from the model's metadata, plus the model card text.

**The Golden Rule: objective facts only.** Report only what the card/metadata states or
what published benchmark numbers support. Never invent numbers, dates, or percentages.
When a fact is not disclosed, use the string `"undisclosed"`.

Return **ONLY** a JSON object with this exact shape (omit any key you cannot support with
evidence — except the enums, which are required and must be your best conservative reading
of the card and its benchmark table):

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
- Capability levels: ground them in the card's benchmark table (e.g. GSM8K > 85 and
  multi-step reasoning claims → `reasoning_math: high`; a small base model with no
  reasoning claims → `low` or `medium`). Be conservative when evidence is thin.
- `filter_type`: `raw` = no safety tuning (base/uncensored models), `censored` = heavily
  safety-tuned, `hybrid` = standard aligned instruct model.
- `benchmarks`: max 10, copied exactly from the card (prefer MMLU, GSM8K, HumanEval,
  human-preference win rates). Include shot count / variant in `notes`.
- Do not restate architecture facts (parameters, context, quantization) — those are
  handled deterministically.
