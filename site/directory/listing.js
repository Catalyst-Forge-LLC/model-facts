function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

const LEVEL = { low: 1, medium: 2, high: 3 };
const COMPARE_KEY = "mf-compare-slugs";
const MAX_COMPARE = 4;

/** Default filter state (no constraints). */
function emptyState() {
  return {
    access: "all",
    q: "",
    developer: "",
    minParams: 0,
    minContext: 0,
    maxVram: 0,
    filterType: "",
    commercial: "",
    speed: "",
    vision: false,
    audio: false,
    tools: "",
    minReasoning: "",
    minCoding: "",
    refusal: "",
    instruction: "",
    status: "",
    curation: "",
    expert: false,
  };
}

function parseUrlState() {
  const p = new URLSearchParams(location.search);
  const toolsRaw = p.get("tools") || "";
  const commercial = p.get("commercial") || "";
  const speed = p.get("speed") || "";
  return {
    access: ["open", "closed"].includes(p.get("access") || "") ? p.get("access") : "all",
    q: p.get("q") || "",
    developer: p.get("developer") || "",
    minParams: Number(p.get("min_params") || 0) || 0,
    minContext: Number(p.get("min_context") || 0) || 0,
    maxVram: Number(p.get("max_vram") || 0) || 0,
    filterType: p.get("filter") || "",
    commercial: ["yes", "conditional", "undisclosed", "no"].includes(commercial)
      ? commercial
      : "",
    speed: ["flash", "standard", "flagship", "undisclosed"].includes(speed) ? speed : "",
    vision: p.get("vision") === "1",
    audio: p.get("audio") === "1",
    tools: toolsRaw === "native" || toolsRaw === "any" ? toolsRaw : "",
    minReasoning: p.get("min_reasoning") || "",
    minCoding: p.get("min_coding") || "",
    refusal: p.get("refusal") || "",
    instruction: p.get("instruction") || "",
    status: p.get("status") || "",
    curation: p.get("curation") || "",
    expert: p.get("expert") === "1",
  };
}

function writeUrl(state) {
  const p = new URLSearchParams();
  if (state.access !== "all") p.set("access", state.access);
  if (state.q) p.set("q", state.q);
  if (state.developer) p.set("developer", state.developer);
  if (state.minParams > 0) p.set("min_params", String(state.minParams));
  if (state.minContext > 0) p.set("min_context", String(state.minContext));
  if (state.maxVram > 0) p.set("max_vram", String(state.maxVram));
  if (state.filterType) p.set("filter", state.filterType);
  if (state.commercial) p.set("commercial", state.commercial);
  if (state.speed) p.set("speed", state.speed);
  if (state.vision) p.set("vision", "1");
  if (state.audio) p.set("audio", "1");
  if (state.tools) p.set("tools", state.tools);
  if (state.minReasoning) p.set("min_reasoning", state.minReasoning);
  if (state.minCoding) p.set("min_coding", state.minCoding);
  if (state.refusal) p.set("refusal", state.refusal);
  if (state.instruction) p.set("instruction", state.instruction);
  if (state.status) p.set("status", state.status);
  if (state.curation) p.set("curation", state.curation);
  if (state.expert) p.set("expert", "1");

  const qs = p.toString();
  const next = `${location.pathname}${qs ? `?${qs}` : ""}${location.hash}`;
  const cur = `${location.pathname}${location.search}${location.hash}`;
  if (next !== cur) history.replaceState(null, "", next);
}

function meetsMinLevel(actual, min) {
  if (!min) return true;
  return (LEVEL[actual] || 0) >= (LEVEL[min] || 0);
}

function fmtCutoff(v) {
  return v || "—";
}

function fmtTools(v) {
  if (!v || v === "none") return "—";
  return v;
}

function fmtVision(v) {
  return v === "enabled" ? "yes" : "—";
}

function capClass(on) {
  return on ? "cap on" : "cap off";
}

function loadCompare() {
  try {
    const raw = sessionStorage.getItem(COMPARE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function saveCompare(slugs) {
  sessionStorage.setItem(COMPARE_KEY, JSON.stringify(slugs.slice(0, MAX_COMPARE)));
}

async function main() {
  const res = await fetch("/directory/index.json");
  const catalog = await res.json();

  const rowsEl = document.getElementById("rows");
  const countEl = document.getElementById("count");
  const omitEl = document.getElementById("omit-note");
  const emptyEl = document.getElementById("empty");
  const qEl = document.getElementById("q");
  const developerEl = document.getElementById("developer");
  const minParamsEl = document.getElementById("min-params");
  const minContextEl = document.getElementById("min-context");
  const maxVramEl = document.getElementById("max-vram");
  const filterTypeEl = document.getElementById("filter-type");
  const commercialEl = document.getElementById("commercial");
  const speedEl = document.getElementById("speed");
  const resetEl = document.getElementById("reset");
  const expertEl = document.getElementById("expert");
  const visionEl = document.getElementById("vision");
  const audioEl = document.getElementById("audio");
  const toolsEl = document.getElementById("tools");
  const toolsNativeEl = document.getElementById("tools-native");
  const minReasoningEl = document.getElementById("min-reasoning");
  const minCodingEl = document.getElementById("min-coding");
  const refusalEl = document.getElementById("refusal");
  const instructionEl = document.getElementById("instruction");
  const statusEl = document.getElementById("status");
  const curationEl = document.getElementById("curation");
  const accessChips = document.querySelectorAll(".chip[data-access]");
  const compareBar = document.getElementById("compare-bar");
  const compareLabel = document.getElementById("compare-label");
  const compareGo = document.getElementById("compare-go");
  const compareClear = document.getElementById("compare-clear");

  for (const name of uniqueSorted(catalog.models.map((m) => m.developer))) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    developerEl.appendChild(opt);
  }

  let state = parseUrlState();
  let syncing = false;
  let compareSlugs = loadCompare();

  function updateCompareBar() {
    const n = compareSlugs.length;
    compareBar.hidden = n === 0;
    compareLabel.textContent = `${n} selected for compare (max ${MAX_COMPARE})`;
    compareGo.href =
      n >= 2
        ? `/directory/compare/?ids=${encodeURIComponent(compareSlugs.join(","))}`
        : "/directory/compare/";
    compareGo.setAttribute("aria-disabled", n < 2 ? "true" : "false");
  }

  function applyStateToControls() {
    syncing = true;
    accessChips.forEach((b) =>
      b.classList.toggle("active", (b.getAttribute("data-access") || "all") === state.access),
    );
    qEl.value = state.q;
    developerEl.value = state.developer;
    minParamsEl.value = state.minParams > 0 ? String(state.minParams) : "";
    minContextEl.value = state.minContext > 0 ? String(state.minContext) : "";
    maxVramEl.value = state.maxVram > 0 ? String(state.maxVram) : "";
    filterTypeEl.value = state.filterType;
    commercialEl.value = state.commercial;
    speedEl.value = state.speed;
    visionEl.checked = state.vision;
    audioEl.checked = state.audio;
    toolsEl.checked = state.tools === "any";
    toolsNativeEl.checked = state.tools === "native";
    minReasoningEl.value = state.minReasoning;
    minCodingEl.value = state.minCoding;
    refusalEl.value = state.refusal;
    instructionEl.value = state.instruction;
    statusEl.value = state.status;
    curationEl.value = state.curation;
    expertEl.open = state.expert;
    syncing = false;
  }

  function readControls() {
    state.access =
      document.querySelector(".chip[data-access].active")?.getAttribute("data-access") || "all";
    state.q = (qEl.value || "").trim();
    state.developer = developerEl.value;
    state.minParams = Number(minParamsEl.value || 0) || 0;
    state.minContext = Number(minContextEl.value || 0) || 0;
    state.maxVram = Number(maxVramEl.value || 0) || 0;
    state.filterType = filterTypeEl.value;
    state.commercial = commercialEl.value;
    state.speed = speedEl.value;
    state.vision = visionEl.checked;
    state.audio = audioEl.checked;
    if (toolsNativeEl.checked) state.tools = "native";
    else if (toolsEl.checked) state.tools = "any";
    else state.tools = "";
    state.minReasoning = minReasoningEl.value;
    state.minCoding = minCodingEl.value;
    state.refusal = refusalEl.value;
    state.instruction = instructionEl.value;
    state.status = statusEl.value;
    state.curation = curationEl.value;
    state.expert = expertEl.open;
  }

  function filtersActive() {
    const d = emptyState();
    return Object.keys(d).some((k) => {
      if (k === "expert") return false;
      return state[k] !== d[k];
    });
  }

  function matches(m) {
    if (state.access !== "all" && m.weight_access !== state.access) return false;
    if (state.developer && m.developer !== state.developer) return false;
    if (state.filterType && m.filter_type !== state.filterType) return false;
    if (state.commercial && m.commercial_ok !== state.commercial) return false;
    if (state.speed && m.speed_tier !== state.speed) return false;
    if (state.minParams > 0) {
      if (m.parameters_b == null || m.parameters_b < state.minParams) return false;
    }
    if (state.minContext > 0) {
      if (m.context_tokens == null || m.context_tokens < state.minContext) return false;
    }
    if (state.maxVram > 0) {
      if (m.vram_gb_q4 == null || m.vram_gb_q4 > state.maxVram) return false;
    }
    if (state.vision && m.vision_input !== "enabled") return false;
    if (state.audio && m.audio_input !== "enabled") return false;
    if (state.tools === "native" && m.tool_use !== "native") return false;
    if (state.tools === "any" && m.tool_use !== "native" && m.tool_use !== "prompted") return false;
    if (!meetsMinLevel(m.reasoning_math, state.minReasoning)) return false;
    if (!meetsMinLevel(m.coding, state.minCoding)) return false;
    if (state.refusal && m.refusal_sensitivity !== state.refusal) return false;
    if (!meetsMinLevel(m.instruction_following, state.instruction)) return false;
    if (state.status && m.status !== state.status) return false;
    if (state.curation && m.curation !== state.curation) return false;
    if (state.q) {
      const hay = [
        m.name,
        m.developer,
        m.slug,
        m.family || "",
        ...(m.api_ids || []),
        m.ollama_tag || "",
        m.hf_id || "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  function omissionNotes(all) {
    const notes = [];
    if (state.minParams > 0) {
      const n = all.filter((m) => m.parameters_b == null).length;
      if (n) notes.push(`${n} omitted: params undisclosed`);
    }
    if (state.minContext > 0) {
      const n = all.filter((m) => m.context_tokens == null).length;
      if (n) notes.push(`${n} omitted: context undisclosed`);
    }
    if (state.maxVram > 0) {
      const n = all.filter((m) => m.vram_gb_q4 == null).length;
      if (n) notes.push(`${n} omitted: VRAM unknown (often closed APIs)`);
    }
    return notes;
  }

  function render() {
    if (!syncing) readControls();
    writeUrl(state);
    const models = catalog.models.filter(matches);
    countEl.textContent = `${models.length} of ${catalog.count} models`;
    const notes = omissionNotes(catalog.models);
    if (notes.length) {
      omitEl.hidden = false;
      omitEl.textContent = notes.join(" · ");
    } else {
      omitEl.hidden = true;
      omitEl.textContent = "";
    }
    resetEl.hidden = !filtersActive();
    emptyEl.hidden = models.length > 0;
    rowsEl.innerHTML = models
      .map((m) => {
        const toolsOn = m.tool_use === "native" || m.tool_use === "prompted";
        const visionOn = m.vision_input === "enabled";
        const checked = compareSlugs.includes(m.slug) ? " checked" : "";
        return `<tr>
          <td class="col-check"><input type="checkbox" class="compare-cb" data-slug="${escapeHtml(m.slug)}"${checked} aria-label="Compare ${escapeHtml(m.name)}" /></td>
          <td><a href="${escapeHtml(m.href)}">${escapeHtml(m.name)}</a></td>
          <td>${escapeHtml(m.developer)}</td>
          <td>${escapeHtml(m.parameters)}</td>
          <td>${escapeHtml(m.context_window)}</td>
          <td><span class="${capClass(toolsOn)}">${escapeHtml(fmtTools(m.tool_use))}</span></td>
          <td><span class="${capClass(visionOn)}">${escapeHtml(fmtVision(m.vision_input))}</span></td>
          <td>${escapeHtml(fmtCutoff(m.knowledge_cutoff))}</td>
          <td><span class="badge commercial-${escapeHtml(m.commercial_ok)}">${escapeHtml(m.commercial_ok)}</span></td>
          <td>${escapeHtml(m.speed_tier)}</td>
          <td><span class="badge ${escapeHtml(m.weight_access)}">${escapeHtml(m.weight_access)}</span></td>
        </tr>`;
      })
      .join("");
    updateCompareBar();
  }

  rowsEl.addEventListener("change", (ev) => {
    const t = ev.target;
    if (!(t instanceof HTMLInputElement) || !t.classList.contains("compare-cb")) return;
    const slug = t.getAttribute("data-slug");
    if (!slug) return;
    if (t.checked) {
      if (compareSlugs.length >= MAX_COMPARE) {
        t.checked = false;
        return;
      }
      if (!compareSlugs.includes(slug)) compareSlugs.push(slug);
    } else {
      compareSlugs = compareSlugs.filter((s) => s !== slug);
    }
    saveCompare(compareSlugs);
    updateCompareBar();
  });

  compareClear.addEventListener("click", () => {
    compareSlugs = [];
    saveCompare(compareSlugs);
    render();
  });

  accessChips.forEach((btn) => {
    btn.addEventListener("click", () => {
      accessChips.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.access = btn.getAttribute("data-access") || "all";
      render();
    });
  });

  toolsEl.addEventListener("change", () => {
    if (toolsEl.checked) toolsNativeEl.checked = false;
    render();
  });
  toolsNativeEl.addEventListener("change", () => {
    if (toolsNativeEl.checked) toolsEl.checked = false;
    render();
  });

  expertEl.addEventListener("toggle", () => {
    state.expert = expertEl.open;
    render();
  });

  const inputs = [
    qEl,
    developerEl,
    minParamsEl,
    minContextEl,
    maxVramEl,
    filterTypeEl,
    commercialEl,
    speedEl,
    visionEl,
    audioEl,
    minReasoningEl,
    minCodingEl,
    refusalEl,
    instructionEl,
    statusEl,
    curationEl,
  ];
  for (const el of inputs) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  }

  resetEl.addEventListener("click", () => {
    state = emptyState();
    applyStateToControls();
    render();
  });

  window.addEventListener("popstate", () => {
    state = parseUrlState();
    applyStateToControls();
    render();
  });

  applyStateToControls();
  render();
}

main();
