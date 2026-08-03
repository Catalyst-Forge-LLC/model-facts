async function main() {
  const res = await fetch("/directory/index.json");
  const catalog = await res.json();
  const rowsEl = document.getElementById("rows");
  const countEl = document.getElementById("count");
  const qEl = document.getElementById("q");
  let access = "all";

  function render() {
    const q = (qEl.value || "").trim().toLowerCase();
    const models = catalog.models.filter((m) => {
      if (access !== "all" && m.weight_access !== access) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.developer.toLowerCase().includes(q) ||
        m.slug.includes(q)
      );
    });
    countEl.textContent = models.length + " of " + catalog.count + " models";
    rowsEl.innerHTML = models
      .map(
        (m) =>
          "<tr data-access=\"" +
          m.weight_access +
          '\"><td><a href="' +
          m.href +
          '">' +
          escapeHtml(m.name) +
          '</a></td><td>' +
          escapeHtml(m.developer) +
          "</td><td>" +
          escapeHtml(m.parameters) +
          "</td><td>" +
          escapeHtml(m.context_window) +
          '</td><td>' +
          escapeHtml(m.filter_type) +
          '</td><td><span class="badge ' +
          m.weight_access +
          '">' +
          m.weight_access +
          "</span></td></tr>",
      )
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      access = btn.getAttribute("data-filter") || "all";
      render();
    });
  });
  qEl.addEventListener("input", render);
  render();
}
main();
