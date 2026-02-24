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
  "short_hm_symbol_aliases",
  "short_hm_symbol_aliases_latex",
  "universal_hm",
  "universal_hm_latex",
  "n_c",
  "crystal_system",
  "point_group",
  "is_reference_setting"
];

const SETTINGS_ALL = "all";
const SETTINGS_ITA = "ita";
const SETTINGS_QUERY_KEY = "settings";
const SETTINGS_STORAGE_KEY = "spacegroup_settings_mode";
const SYMOPS_QUERY_KEY = "symops";
const WYCKOFF_QUERY_KEY = "wyckoff";
const QUERY_VALUE_OPEN = "open";
const QUERY_VALUE_CLOSED = "closed";
const TRIANGLE_OPEN = "\u25BE";
const TRIANGLE_CLOSED = "\u25B8";

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

const normalizeSettingsMode = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === SETTINGS_ALL || normalized === SETTINGS_ITA) {
    return normalized;
  }
  return null;
};

const getModeFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    return normalizeSettingsMode(url.searchParams.get(SETTINGS_QUERY_KEY));
  } catch {
    return null;
  }
};

const getSectionOpenFromUrl = (queryKey, defaultOpen = true) => {
  try {
    const url = new URL(window.location.href);
    const value = String(url.searchParams.get(queryKey) || "").trim().toLowerCase();
    if (value === QUERY_VALUE_OPEN) {
      return true;
    }
    if (value === QUERY_VALUE_CLOSED) {
      return false;
    }
  } catch {
    // Ignore URL parsing errors.
  }
  return defaultOpen;
};

const getModeFromStorage = () => {
  try {
    return normalizeSettingsMode(window.localStorage.getItem(SETTINGS_STORAGE_KEY));
  } catch {
    return null;
  }
};

const sortState = { key: "ita_number", direction: "asc" };
let allRows = [];
let filteredRows = [];
let settingsMode = getModeFromUrl() || getModeFromStorage() || SETTINGS_ITA;
let sectionState = {
  symops: getSectionOpenFromUrl(SYMOPS_QUERY_KEY, true),
  wyckoff: getSectionOpenFromUrl(WYCKOFF_QUERY_KEY, true)
};

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

const resolveBase = () => {
  const explicit = typeof window.SPACEGROUP_BASE_URL === "string" ? window.SPACEGROUP_BASE_URL : "";
  if (explicit) {
    try {
      const url = new URL(explicit, window.location.origin);
      const basePath = url.pathname || "/";
      return basePath.endsWith("/") ? basePath : `${basePath}/`;
    } catch {
      return explicit.endsWith("/") ? explicit : `${explicit}/`;
    }
  }

  if (document.currentScript && document.currentScript.src) {
    try {
      const url = new URL(document.currentScript.src, window.location.origin);
      const basePath = url.pathname.replace(/app\\.js(?:\\?.*)?$/, "");
      return basePath.endsWith("/") ? basePath : `${basePath}/`;
    } catch {
      // Ignore and fall through.
    }
  }

  const path = window.location.pathname || "/";
  if (path.includes("/hall/")) {
    return path.split("/hall/")[0] + "/";
  }
  return path.endsWith("/") ? path : path.replace(/[^/]+$/, "");
};

const withNavigationQuery = (targetPath, mode) => {
  const activeMode = normalizeSettingsMode(mode) || SETTINGS_ALL;
  const url = new URL(targetPath, window.location.origin);
  url.searchParams.set(SETTINGS_QUERY_KEY, activeMode);
  url.searchParams.set(SYMOPS_QUERY_KEY, sectionState.symops ? QUERY_VALUE_OPEN : QUERY_VALUE_CLOSED);
  url.searchParams.set(WYCKOFF_QUERY_KEY, sectionState.wyckoff ? QUERY_VALUE_OPEN : QUERY_VALUE_CLOSED);
  return `${url.pathname}${url.search}`;
};

const buildHallUrl = (baseUrl, hallKey, mode = settingsMode) => {
  const rawPath = `${baseUrl}hall/${encodeURIComponent(hallKey)}/`;
  return withNavigationQuery(rawPath, mode);
};

const buildRootUrl = (baseUrl, mode = settingsMode) => {
  return withNavigationQuery(baseUrl, mode);
};

const syncModeUrlAndStorage = () => {
  const normalized = normalizeSettingsMode(settingsMode) || SETTINGS_ALL;
  settingsMode = normalized;

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, normalized);
  } catch {
    // Ignore storage failures.
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set(SETTINGS_QUERY_KEY, normalized);
    url.searchParams.set(SYMOPS_QUERY_KEY, sectionState.symops ? QUERY_VALUE_OPEN : QUERY_VALUE_CLOSED);
    url.searchParams.set(WYCKOFF_QUERY_KEY, sectionState.wyckoff ? QUERY_VALUE_OPEN : QUERY_VALUE_CLOSED);
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) {
      window.history.replaceState({}, "", next);
    }
  } catch {
    // Ignore URL update failures.
  }
};

const getRowsForMode = (rows) => {
  if (settingsMode !== SETTINGS_ITA) {
    return rows;
  }
  return rows.filter((row) => Boolean(row.is_reference_setting));
};

const applyFilters = () => {
  const visibleRows = getRowsForMode(allRows);
  if (!tableView || !searchInput) {
    filteredRows = visibleRows;
    return;
  }
  filteredRows = filterIndex(visibleRows, searchInput.value);
};

const updateSummary = () => {
  if (!searchSummary) {
    return;
  }
  const query = searchInput ? searchInput.value.trim() : "";
  if (!query) {
    searchSummary.textContent = "Showing all spacegroups";
    return;
  }
  searchSummary.textContent = `Query "${query}" returned ${filteredRows.length} result${filteredRows.length === 1 ? "" : "s"}`;
};

const isLikelyLatex = (value) => {
  return typeof value === "string" && (value.includes("\\(") || value.includes("$"));
};

const renderMaybeMath = (value) => {
  const text = escapeHtml(formatValue(value));
  if (isLikelyLatex(value)) {
    return `<span class="math-content">${text}</span>`;
  }
  return text;
};

const getArrayValues = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item) => item !== null && item !== undefined && String(item).trim() !== "");
};

const renderHmWithAliases = (row) => {
  const baseLabel = renderMaybeMath(row.short_hm_symbol_latex || row.short_hm_symbol);
  const aliasesLatex = getArrayValues(row.short_hm_symbol_aliases_latex);
  const aliasesPlain = getArrayValues(row.short_hm_symbol_aliases);
  const aliases = aliasesLatex.length ? aliasesLatex : aliasesPlain;
  if (!aliases.length) {
    return baseLabel;
  }
  const aliasLabel = aliases.map((item) => renderMaybeMath(item)).join(", ");
  return `${baseLabel} (${aliasLabel})`;
};

const renderTable = () => {
  if (!tableBody || !emptyState) {
    return;
  }

  const baseUrl = resolveBase();
  const rows = sortRows(filteredRows);
  tableBody.innerHTML = rows
    .map((row) => {
      const hallLabel = renderMaybeMath(row.hall_latex || row.hall_key);
      const hallUrl = buildHallUrl(baseUrl, row.hall_key);
      const shortHmLabel = renderHmWithAliases(row);
      return `
      <tr class="sg-row" data-active="false" data-hall-url="${hallUrl}">
        <td>${shortHmLabel}</td>
        <td>${escapeHtml(formatValue(row.ita_number))}</td>
        <td><a class="hall-link" href="${hallUrl}">${hallLabel}</a></td>
        <td class="td-muted">${escapeHtml(formatValue(row.crystal_system))}</td>
        <td class="td-muted">${escapeHtml(formatValue(row.point_group))}</td>
        <td class="td-muted">${escapeHtml(formatValue(row.n_c))}</td>
      </tr>`;
    })
    .join("");

  emptyState.hidden = rows.length > 0;
  updateSummary();

  if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
    tableBody.classList.add("math-pending");
    window.MathJax.typesetPromise([tableBody])
      .catch((err) => {
        console.warn("MathJax typeset failed", err);
      })
      .finally(() => {
        tableBody.classList.remove("math-pending");
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
      Array.isArray(item.short_hm_symbol_aliases) ? item.short_hm_symbol_aliases.join(" ") : item.short_hm_symbol_aliases,
      Array.isArray(item.short_hm_symbol_aliases_latex)
        ? item.short_hm_symbol_aliases_latex.join(" ")
        : item.short_hm_symbol_aliases_latex,
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

const updateSettingsButtons = () => {
  document.querySelectorAll("[data-settings-toggle]").forEach((button) => {
    button.dataset.mode = settingsMode;
    button.setAttribute("aria-pressed", settingsMode === SETTINGS_ITA ? "true" : "false");
    button.setAttribute(
      "title",
      settingsMode === SETTINGS_ITA ? "Settings mode: ITA reference only" : "Settings mode: all"
    );
  });
};

const updateSectionToggles = () => {
  document.querySelectorAll("[data-section-toggle]").forEach((button) => {
    const key = button.getAttribute("data-section-toggle");
    if (!key || !(key in sectionState)) {
      return;
    }
    const isOpen = Boolean(sectionState[key]);
    button.textContent = isOpen ? TRIANGLE_OPEN : TRIANGLE_CLOSED;
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    button.setAttribute("aria-label", isOpen ? "Collapse section" : "Expand section");
  });

  document.querySelectorAll("[data-section-body]").forEach((body) => {
    const key = body.getAttribute("data-section-body");
    if (!key || !(key in sectionState)) {
      return;
    }
    body.hidden = !sectionState[key];
  });
};

const updateStaticHallLinks = () => {
  document.querySelectorAll("a.hall-link[href], a.related-link[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) {
      return;
    }

    let parsed;
    try {
      parsed = new URL(href, window.location.origin);
    } catch {
      return;
    }

    if (!parsed.pathname.includes("/hall/")) {
      return;
    }

    const explicitMode = normalizeSettingsMode(parsed.searchParams.get(SETTINGS_QUERY_KEY));
    const mode = explicitMode || settingsMode;
    anchor.setAttribute("href", withNavigationQuery(parsed.pathname, mode));
  });
};

const updateBackButtonHref = () => {
  const backButton = document.querySelector(".header-back-btn");
  if (!backButton) {
    return;
  }
  backButton.setAttribute("href", buildRootUrl(resolveBase()));
};

const getCurrentDetailHallKey = () => {
  const hallSelect = document.querySelector('select.detail-select[data-selected][aria-label="Select Hall symbol"]');
  if (!hallSelect) {
    return null;
  }

  const selectedFromData = hallSelect.dataset.selected;
  if (selectedFromData) {
    return selectedFromData;
  }

  const selectedOption = hallSelect.options[hallSelect.selectedIndex];
  if (selectedOption && selectedOption.dataset.matchValue) {
    return selectedOption.dataset.matchValue;
  }

  return null;
};

const maybeRedirectToItaReferenceSetting = () => {
  const currentHallKey = getCurrentDetailHallKey();
  if (!currentHallKey) {
    return false;
  }

  const current = allRows.find((row) => row.hall_key === currentHallKey);
  if (!current || current.is_reference_setting) {
    return false;
  }

  if (current.ita_number === null || current.ita_number === undefined) {
    return false;
  }

  const siblings = allRows.filter((row) => row.ita_number === current.ita_number);
  const standard = chooseStandardSetting(siblings);
  if (!standard || standard.hall_key === currentHallKey) {
    return false;
  }

  window.location.assign(buildHallUrl(resolveBase(), standard.hall_key, SETTINGS_ITA));
  return true;
};

const setupEvents = () => {
  if (searchInput) {
    let debounceTimer = null;
    searchInput.addEventListener("input", () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        applyFilters();
        renderTable();
      }, 220);
    });
  }

  document.querySelectorAll("[data-section-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-section-toggle");
      if (!key || !(key in sectionState)) {
        return;
      }

      sectionState[key] = !sectionState[key];
      syncModeUrlAndStorage();
      updateSectionToggles();
      updateStaticHallLinks();
      updateBackButtonHref();
    });
  });

  if (tableBody) {
    tableBody.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (target.closest("a, button, input, select, textarea, label")) {
        return;
      }

      const row = target.closest("tr.sg-row");
      if (!row) {
        return;
      }
      const hallUrl = row.getAttribute("data-hall-url");
      if (hallUrl) {
        window.location.assign(hallUrl);
      }
    });
  }

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

  document.querySelectorAll("[data-settings-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      settingsMode = settingsMode === SETTINGS_ITA ? SETTINGS_ALL : SETTINGS_ITA;
      syncModeUrlAndStorage();
      if (settingsMode === SETTINGS_ITA && maybeRedirectToItaReferenceSetting()) {
        return;
      }
      refreshUiState();
    });
  });
};

const chooseStandardSetting = (entries) => {
  if (!entries.length) {
    return null;
  }
  const standard = entries.find((entry) => entry.is_reference_setting);
  return standard || entries[0];
};

const buildIndexRows = (data) => {
  const rows = Object.entries(data).map(([hallKey, entry]) => {
    const row = { hall_key: hallKey };
    INDEX_FIELDS.forEach((field) => {
      if (field === "hall_key") {
        return;
      }
      row[field] = entry[field] ?? null;
    });
    return row;
  });

  return rows.sort((a, b) => {
    const itaA = a.ita_number ?? 0;
    const itaB = b.ita_number ?? 0;
    if (itaA !== itaB) {
      return itaA - itaB;
    }
    return String(a.hall_key).localeCompare(String(b.hall_key));
  });
};

const buildLists = (rows) => {
  const hmGroups = new Map();
  const itaGroups = new Map();
  const hmValues = new Set();
  const itaValues = new Set();

  rows.forEach((row) => {
    if (row.universal_hm) {
      const key = String(row.universal_hm);
      hmValues.add(key);
      if (!hmGroups.has(key)) {
        hmGroups.set(key, []);
      }
      hmGroups.get(key).push(row);
    }
    if (row.ita_number !== null && row.ita_number !== undefined) {
      const key = Number(row.ita_number);
      itaValues.add(key);
      if (!itaGroups.has(key)) {
        itaGroups.set(key, []);
      }
      itaGroups.get(key).push(row);
    }
  });

  const hmToHall = {};
  const hmDisplay = {};
  hmGroups.forEach((entries, hm) => {
    const selected = chooseStandardSetting(entries);
    if (selected) {
      hmToHall[hm] = selected.hall_key;
      const aliases = getArrayValues(selected.short_hm_symbol_aliases);
      hmDisplay[hm] = aliases.length ? `${hm} (${aliases.join(", ")})` : hm;
    }
  });

  const itaToHall = {};
  itaGroups.forEach((entries, ita) => {
    const selected = chooseStandardSetting(entries);
    if (selected) {
      itaToHall[String(ita)] = selected.hall_key;
    }
  });

  return {
    halls: rows.map((row) => row.hall_key),
    hmValues: Array.from(hmValues).sort(),
    itaValues: Array.from(itaValues).sort((a, b) => a - b),
    hmToHall,
    hmDisplay,
    itaToHall
  };
};

const populateSelect = (select, items, selectedValue, buildOption) => {
  if (!select) {
    return;
  }
  select.innerHTML = "";
  items.forEach((item) => {
    const option = buildOption(item);
    if (selectedValue !== null && selectedValue !== undefined) {
      if (String(option.dataset.matchValue) === String(selectedValue)) {
        option.selected = true;
      }
    }
    select.appendChild(option);
  });
};

const populateDetailSelects = (lists) => {
  const baseUrl = resolveBase();
  const hallSelects = document.querySelectorAll('select.detail-select[data-selected][aria-label="Select Hall symbol"]');
  const hmSelects = document.querySelectorAll('select.detail-select[data-selected][aria-label="Select HM symbol"]');
  const itaSelects = document.querySelectorAll('select.detail-select[data-selected][aria-label="Select ITA number"]');

  hallSelects.forEach((select) => {
    const selected = select.dataset.selected;
    populateSelect(select, lists.halls, selected, (hallKey) => {
      const option = document.createElement("option");
      option.value = buildHallUrl(baseUrl, hallKey);
      option.textContent = hallKey;
      option.dataset.matchValue = hallKey;
      return option;
    });
  });

  hmSelects.forEach((select) => {
    const selected = select.dataset.selected;
    populateSelect(select, lists.hmValues, selected, (hm) => {
      const hall = lists.hmToHall[hm];
      const option = document.createElement("option");
      option.value = hall ? buildHallUrl(baseUrl, hall) : "";
      option.textContent = lists.hmDisplay[hm] || hm;
      option.dataset.matchValue = hm;
      return option;
    });
  });

  itaSelects.forEach((select) => {
    const selected = select.dataset.selected;
    populateSelect(select, lists.itaValues, selected, (ita) => {
      const hall = lists.itaToHall[String(ita)];
      const option = document.createElement("option");
      option.value = hall ? buildHallUrl(baseUrl, hall) : "";
      option.textContent = `#${ita}`;
      option.dataset.matchValue = String(ita);
      return option;
    });
  });
};

const refreshUiState = () => {
  const modeRows = getRowsForMode(allRows);
  const lists = buildLists(modeRows);
  populateDetailSelects(lists);

  if (tableView) {
    applyFilters();
    renderTable();
  }

  updateSettingsButtons();
  updateSectionToggles();
  updateStaticHallLinks();
  updateBackButtonHref();
};

const initIndex = async () => {
  syncModeUrlAndStorage();
  updateSettingsButtons();
  updateBackButtonHref();

  const baseUrl = resolveBase();
  let data = null;
  try {
    const response = await fetch(`${baseUrl}spacegroup_data.json`, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Failed to load spacegroup data (${response.status})`);
    }
    data = await response.json();
  } catch (error) {
    console.warn("Unable to load spacegroup data JSON", error);
  }

  if (!data) {
    setupEvents();
    return;
  }

  allRows = buildIndexRows(data);
  setupEvents();
  refreshUiState();
};

initIndex();
