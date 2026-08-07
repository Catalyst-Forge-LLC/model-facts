function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseIds() {
  const raw = new URLSearchParams(location.search).get("ids") || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
}

const ROWS = [
  ["Name", (m) => m.name],
  ["Developer", (m) => m.developer],
  ["Access", (m) => m.weight_access],
  ["License", (m) => m.license],
  ["Commercial", (m) => m.commercial_ok],
  ["Parameters", (m) => m.parameters],
  ["Context", (m) => m.context_window],
  ["Knowledge cutoff", (m) => m.knowledge_cutoff || "undisclosed"],
  ["Tools", (m) => m.tool_use || "—"],
  ["Vision", (m) => m.vision_input],
  ["Audio", (m) => m.audio_input],
  ["Speed tier", (m) => m.speed_tier],
  ["Price tier", (m) => m.price_tier],
  ["VRAM Q4 (GB)", (m) => (m.vram_gb_q4 != null ? String(m.vram_gb_q4) : "—")],
  ["Filter type", (m) => m.filter_type],
  ["API ids", (m) => (m.api_ids || []).join(", ") || "—"],
  ["Ollama tag", (m) => m.ollama_tag || "—"],
  ["HF id", (m) => m.hf_id || "—"],
  ["Family", (m) => m.family || "—"],
  ["Capability basis", (m) => m.capability_basis || "—"],
  ["Reasoning (claimed)", (m) => m.reasoning_math],
  ["Coding (claimed)", (m) => m.coding],
  ["Refusal (claimed)", (m) => m.refusal_sensitivity],
  ["Label", (m) => `<a href="${escapeHtml(m.href)}">Open</a>`],
];

async function main() {
  const statusEl = document.getElementById("status");
  const wrap = document.getElementById("table-wrap");
  const emptyEl = document.getElementById("empty");
  const ids = parseIds();

  if (ids.length < 2) {
    emptyEl.hidden = false;
    statusEl.textContent = ids.length
      ? "Need at least two slugs in ?ids=…"
      : "No models selected.";
    return;
  }

  const res = await fetch("/directory/index.json");
  const catalog = await res.json();
  const bySlug = new Map(catalog.models.map((m) => [m.slug, m]));
  const models = ids.map((id) => bySlug.get(id)).filter(Boolean);
  const missing = ids.filter((id) => !bySlug.has(id));

  if (models.length < 2) {
    emptyEl.hidden = false;
    statusEl.textContent = missing.length
      ? `Unknown slug(s): ${missing.join(", ")}`
      : "Need at least two valid slugs.";
    return;
  }

  statusEl.textContent = `Comparing ${models.length} models${
    missing.length ? ` · unknown: ${missing.join(", ")}` : ""
  }`;
  emptyEl.hidden = true;

  const head = models
    .map((m) => `<th><a href="${escapeHtml(m.href)}">${escapeHtml(m.name)}</a></th>`)
    .join("");
  const body = ROWS.map(([label, fn]) => {
    const cells = models
      .map((m) => {
        const v = fn(m);
        return `<td>${typeof v === "string" && v.startsWith("<a ") ? v : escapeHtml(String(v))}</td>`;
      })
      .join("");
    return `<tr><th scope="row">${escapeHtml(label)}</th>${cells}</tr>`;
  }).join("");

  wrap.innerHTML = `<table class="compare-table">
    <thead><tr><th scope="col">Field</th>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>`;
}

main();
