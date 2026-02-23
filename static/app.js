const tableView = document.getElementById("table-view");
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search-input");
const searchSummary = document.getElementById("search-summary");
const emptyState = document.getElementById("empty-state");

const INDEX_FIELDS = [
  "hall_key",
  "hall_latex",
  "ita_number",
  "short_hm_symbol",
  "short_hm_symbol_latex",
  "universal_hm",
  "universal_hm_latex",
  "n_c",
  "crystal_system",
  "point_group",
  "is_reference_setting"
];

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "\u2014";
  }
  if (Array.isArray(value)) {
    return value.join(", ") || "\u2014";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
};

const sortState = { key: "ita_number", direction: "asc" };
let allRows = [];
let filteredRows = [];

const sortRows = (rows) => {
  const { key, direction } = sortState;
  const scalar = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aRaw = a[key];
    const bRaw = b[key];
    const aValue = Array.isArray(aRaw) ? aRaw.join(",") : aRaw;
    const bValue = Array.isArray(bRaw) ? bRaw.join(",") : bRaw;

    if (aValue === null || aValue === undefined) {
      return 1;
    }
    if (bValue === null || bValue === undefined) {
      return -1;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * scalar;
    }
    return String(aValue).localeCompare(String(bValue), undefined, { numeric: true }) * scalar;
  });
};

const updateSummary = () => {
  const query = searchInput.value.trim();
  if (!query) {
    searchSummary.textContent = "Showing all spacegroups";
    return;
  }
  searchSummary.textContent = `Query "${query}" returned ${filteredRows.length} result${filteredRows.length === 1 ? "" : "s"}`;
};

const resolveBase = () => {
  const base = typeof window.SPACEGROUP_BASE_URL === "string" ? window.SPACEGROUP_BASE_URL : "/";
  return base.endsWith("/") ? base : `${base}/`;
};

const renderTable = () => {
  const baseUrl = resolveBase();
  const rows = sortRows(filteredRows);
  tableBody.innerHTML = rows
    .map((row) => {
      const hallLabel = escapeHtml(formatValue(row.hall_latex || row.hall_key));
      const hallUrl = `${baseUrl}hall/${encodeURIComponent(row.hall_key)}/`;
      const shortHmLabel = escapeHtml(formatValue(row.short_hm_symbol_latex || row.short_hm_symbol));
      return `
      <tr class="sg-row" data-active="false">
        <td><a class="hall-link" href="${hallUrl}">${hallLabel}</a></td>
        <td>${escapeHtml(formatValue(row.ita_number))}</td>
        <td>${shortHmLabel}</td>
        <td class="td-muted">${escapeHtml(formatValue(row.crystal_system))}</td>
        <td class="td-muted">${escapeHtml(formatValue(row.point_group))}</td>
        <td class="td-muted">${escapeHtml(formatValue(row.n_c))}</td>
      </tr>`;
    })
    .join("");

  emptyState.hidden = rows.length > 0;
  updateSummary();

  if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
    window.MathJax.typesetPromise([tableBody]).catch((err) => {
      console.warn("MathJax typeset failed", err);
    });
  }
};

const filterIndex = (rows, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    return rows;
  }

  return rows.filter((item) => {
    const haystack = [
      item.hall_key,
      item.hall_latex,
      item.short_hm_symbol,
      item.short_hm_symbol_latex,
      item.universal_hm,
      item.universal_hm_latex,
      item.ita_number,
      Array.isArray(item.n_c) ? item.n_c.join(" ") : item.n_c,
      item.crystal_system,
      item.point_group
    ]
      .map((value) => String(value ?? ""))
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
};

const setupEvents = () => {
  let debounceTimer = null;

  searchInput.addEventListener("input", () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      filteredRows = filterIndex(allRows, searchInput.value);
      renderTable();
    }, 220);
  });

  document.querySelectorAll(".sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (!key) {
        return;
      }

      if (sortState.key === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.key = key;
        sortState.direction = "asc";
      }

      renderTable();
    });
  });
};

const initIndex = () => {
  if (!tableView || !window.SPACEGROUP_INDEX) {
    return;
  }

  if (!Array.isArray(window.SPACEGROUP_INDEX)) {
    console.error("SPACEGROUP_INDEX is not an array");
    return;
  }

  const rows = window.SPACEGROUP_INDEX.map((row) => {
    const safeRow = {};
    INDEX_FIELDS.forEach((field) => {
      safeRow[field] = row[field] ?? null;
    });
    return safeRow;
  });

  allRows = rows;
  filteredRows = rows;
  setupEvents();
  renderTable();
};

initIndex();
