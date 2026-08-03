/** Render the human-readable Markdown body from frontmatter. */
import type { ModelFacts } from "./types.js";

function kv(rows: Array<[string, string | undefined]>): string {
  const filtered = rows.filter((r): r is [string, string] => !!r[1]);
  return ["| | |", "|---|---|", ...filtered.map(([k, v]) => `| ${k} | ${v} |`)].join("\n");
}

export function renderBody(f: ModelFacts): string {
  const parts: string[] = [];

  parts.push(`# Model Facts — ${f.name}`);
  parts.push(
    kv([
      ["**Developer**", f.developer],
      ["**Status**", f.status],
      ["**License**", f.license],
      ["**Released**", f.release_date],
      ["**Base model**", f.base_model],
    ]),
  );

  const a = f.architecture;
  const modalities =
    a.modalities_in && a.modalities_out
      ? `${a.modalities_in.join(" + ")} → ${a.modalities_out.join(" + ")}`
      : undefined;
  parts.push("## Architecture");
  parts.push(
    kv([
      ["Type", a.type],
      ["Parameters", a.parameters],
      ["Active parameters", a.active_parameters],
      ["Context window", a.context_window],
      ["Quantization", a.quantization],
      ["Modalities", modalities],
    ]),
  );

  const t = f.training;
  parts.push("## Training Provenance");
  parts.push(
    kv([
      ["Knowledge cutoff", t.knowledge_cutoff],
      ["Methodology", t.methodology],
      ["Tokens", t.tokens],
    ]),
  );
  if (t.data_composition?.length) {
    parts.push(
      [
        "| Component | % | Source | Purpose |",
        "|---|---|---|---|",
        ...t.data_composition.map(
          (d) => `| ${d.component} | ${d.percent} | ${d.source_type} | ${d.purpose} |`,
        ),
      ].join("\n"),
    );
  }

  const c = f.capabilities;
  parts.push("## Capabilities");
  parts.push(
    [
      "| Capability | Level |",
      "|---|---|",
      `| Natural language | ${c.natural_language} |`,
      `| Reasoning / math | ${c.reasoning_math} |`,
      `| Coding | ${c.coding} |`,
      `| Vision (input) | ${c.vision_input} |`,
      `| Audio (input) | ${c.audio_input} |`,
      ...(c.tool_use ? [`| Tool use | ${c.tool_use} |`] : []),
    ].join("\n"),
  );
  const capNotes = [c.languages, c.notes].filter(Boolean).join(" ");
  if (capNotes) parts.push(`*${capNotes}*`);

  const s = f.safety;
  parts.push("## Safety Profile");
  parts.push(
    kv([
      ["Refusal sensitivity", s.refusal_sensitivity],
      ["Instruction following", s.instruction_following],
      ["Filter type", s.filter_type],
      [
        "Hallucination",
        s.hallucination_benchmark
          ? `${s.hallucination_benchmark.name} ${s.hallucination_benchmark.score}`
          : undefined,
      ],
    ]),
  );

  if (f.benchmarks?.length) {
    parts.push("## Benchmarks");
    parts.push(
      [
        "| Benchmark | Score | Notes |",
        "|---|---|---|",
        ...f.benchmarks.map((b) => `| ${b.name} | ${b.score} | ${b.notes ?? ""} |`),
      ].join("\n"),
    );
  }

  const credit = f.credits?.built_by
    ? `*Generated with [ModelFacts](https://modelfacts.dev) · Built by ${f.credits.built_by}*`
    : "*Generated with [ModelFacts](https://modelfacts.dev)*";
  parts.push("---\n" + credit);

  return parts.join("\n\n") + "\n";
}
