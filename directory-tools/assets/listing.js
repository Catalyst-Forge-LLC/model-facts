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

async function main() {
  const res = await fetch("/directory/index.json");
  const catalog = await res.json();
  const rowsEl = document.getElementById("rows");
  const countEl = document.getElementById("count");
  const emptyEl = document.getElementById("empty");
  const qEl = document.getElementById("q");
  const developerEl = document.getElementById("developer");
  const minParamsEl = document.getElementById("min-params");
  const minContextEl = document.getElementById("min-context");
  const filterTypeEl = document.getElementById("filter-type");
  const resetEl = document.getElementById("reset");
  const accessChips = document.querySelectorAll(".chip[data-access]");

  for (const name of uniqueSorted(catalog.models.map((m) => m.developer))) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    developerEl.appendChild(opt);
  }

  const state = {
    access: "all",
    q: "",
    developer: "",
    minParams: 0,
    minContext: 0,
    filterType: "",
  };

  function readControls() {
    state.q = (qEl.value || "").trim().toLowerCase();
    state.developer = developerEl.value;
    state.minParams = Number(minParamsEl.value || 0);
    state.minContext = Number(minContextEl.value || 0);
    state.filterType = filterTypeEl.value;
  }

  function filtersActive() {
    return (
      state.access !== "all" ||
      !!state.q ||
      !!state.developer ||
      state.minParams > 0 ||
      state.minContext > 0 ||
      !!state.filterType
    );
  }

  function matches(m) {
    if (state.access !== "all" && m.weight_access !== state.access) return false;
    if (state.developer && m.developer !== state.developer) return false;
    if (state.filterType && m.filter_type !== state.filterType) return false;
    if (state.minParams > 0) {
      if (m.parameters_b == null || m.parameters_b < state.minParams) return false;
    }
    if (state.minContext > 0) {
      if (m.context_tokens == null || m.context_tokens < state.minContext) return false;
    }
    if (state.q) {
      const hay = `${m.name} ${m.developer} ${m.slug}`.toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  }

  function render() {
    readControls();
    const models = catalog.models.filter(matches);
    countEl.textContent = `${models.length} of ${catalog.count} models`;
    resetEl.hidden = !filtersActive();
    emptyEl.hidden = models.length > 0;
    rowsEl.innerHTML = models
      .map(
        (m) => `<tr>
          <td><a href="${escapeHtml(m.href)}">${escapeHtml(m.name)}</a></td>
          <td>${escapeHtml(m.developer)}</td>
          <td>${escapeHtml(m.parameters)}</td>
          <td>${escapeHtml(m.context_window)}</td>
          <td>${escapeHtml(m.filter_type)}</td>
          <td><span class="badge ${escapeHtml(m.weight_access)}">${escapeHtml(m.weight_access)}</span></td>
        </tr>`,
      )
      .join("");
  }

  accessChips.forEach((btn) => {
    btn.addEventListener("click", () => {
      accessChips.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.access = btn.getAttribute("data-access") || "all";
      render();
    });
  });

  for (const el of [qEl, developerEl, minParamsEl, minContextEl, filterTypeEl]) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  }

  resetEl.addEventListener("click", () => {
    state.access = "all";
    accessChips.forEach((b) => b.classList.toggle("active", b.getAttribute("data-access") === "all"));
    qEl.value = "";
    developerEl.value = "";
    minParamsEl.value = "";
    minContextEl.value = "";
    filterTypeEl.value = "";
    render();
  });

  render();
}

main();
