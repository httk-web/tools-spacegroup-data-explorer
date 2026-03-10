const tableView = document.getElementById("table-view");
const indexTable = document.getElementById("index-table");
const tableHead = document.getElementById("table-head");
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search-input");
const searchSummary = document.getElementById("search-summary");
const emptyState = document.getElementById("empty-state");
const settingsToggleWrapIndex = document.getElementById("settings-toggle-wrap-index");

const INDEX_FIELDS = [
  "hall_key",
  "hall_entry",
  "hall_latex",
  "hall_unicode",
  "ita_number",
  "hm_short",
  "hm_short_aliases",
  "hm_short_aliases_latex",
  "hm_short_aliases_unicode",
  "hm_short_latex",
  "hm_short_unicode",
  "hm_full",
  "hm_full_latex",
  "hm_full_unicode",
  "hm_extended",
  "hm_extended_latex",
  "hm_extended_unicode",
  "hm_universal",
  "hm_universal_aliases",
  "hm_universal_aliases_latex",
  "hm_universal_aliases_unicode",
  "hm_universal_latex",
  "hm_universal_unicode",
  "short_hm_symbol",
  "short_hm_symbol_latex",
  "short_hm_symbol_unicode",
  "short_hm_symbol_aliases",
  "short_hm_symbol_aliases_latex",
  "universal_hm",
  "universal_hm_latex",
  "universal_hm_unicode",
  "n_c",
  "crystal_system",
  "point_group",
  "is_reference_setting"
];

const INDEX_DATA_PATH = "data/spacegroup_index.json.gz";
const FULL_DATA_PATH = "data/spacegroup_data.json.gz";
const POINTGROUP_INDEX_DATA_PATH = "data/pointgroup_index.json.gz";
const POINTGROUP_BASICS_DATA_PATH = "data/pointgroup_basics.json.gz";

const DATASET_SPACEGROUPS = "spacegroups";
const DATASET_POINTGROUPS = "pointgroups";
const DATASET_QUERY_KEY = "dataset";
const DATASET_STORAGE_KEY = "crystal_dataset_mode";

const SETTINGS_ALL = "all";
const SETTINGS_ITA = "ita";
const SETTINGS_QUERY_KEY = "settings";
const SETTINGS_STORAGE_KEY = "spacegroup_settings_mode";
const SYMOPS_QUERY_KEY = "symops";
const WYCKOFF_QUERY_KEY = "wyckoff";
const MAX_SUBGROUPS_QUERY_KEY = "max_subgroups";
const MIN_SUPERGROUPS_QUERY_KEY = "min_supergroups";
const NORMALIZER_QUERY_KEY = "normalizer";
const K_SUBGROUPS_QUERY_KEY = "k_subgroups";
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

const firstNonEmpty = (...values) => {
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    if (value === null || value === undefined) {
      continue;
    }
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }
    return value;
  }
  return null;
};

const toMaybeNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const normalizeRow = (row) => {
  const normalized = { ...row };

  normalized.hall_entry = firstNonEmpty(row.hall_entry, row.hall_key);
  normalized.hall_latex = firstNonEmpty(row.hall_latex, row.hall_entry, row.hall_key);
  normalized.hall_unicode = firstNonEmpty(row.hall_unicode, row.hall_entry, row.hall_key);

  normalized.hm_short = firstNonEmpty(row.hm_short, row.short_hm_symbol);
  normalized.hm_short_aliases = firstNonEmpty(row.hm_short_aliases, row.short_hm_symbol_aliases);
  normalized.hm_short_aliases_latex = firstNonEmpty(row.hm_short_aliases_latex, row.short_hm_symbol_aliases_latex);
  normalized.hm_short_aliases_unicode = firstNonEmpty(row.hm_short_aliases_unicode, row.hm_short_aliases, row.short_hm_symbol_aliases);
  normalized.hm_short_latex = firstNonEmpty(row.hm_short_latex, row.short_hm_symbol_latex, row.hm_short);
  normalized.hm_short_unicode = firstNonEmpty(row.hm_short_unicode, row.short_hm_symbol_unicode, row.hm_short);

  normalized.hm_full = firstNonEmpty(row.hm_full);
  normalized.hm_full_latex = firstNonEmpty(row.hm_full_latex, row.hm_full);
  normalized.hm_full_unicode = firstNonEmpty(row.hm_full_unicode, row.hm_full);

  normalized.hm_extended = firstNonEmpty(row.hm_extended);
  normalized.hm_extended_latex = firstNonEmpty(row.hm_extended_latex, row.hm_extended);
  normalized.hm_extended_unicode = firstNonEmpty(row.hm_extended_unicode, row.hm_extended);

  normalized.hm_universal = firstNonEmpty(row.hm_universal, row.universal_hm);
  normalized.hm_universal_aliases = firstNonEmpty(row.hm_universal_aliases);
  normalized.hm_universal_aliases_latex = firstNonEmpty(row.hm_universal_aliases_latex, row.hm_universal_aliases);
  normalized.hm_universal_aliases_unicode = firstNonEmpty(row.hm_universal_aliases_unicode, row.hm_universal_aliases);
  normalized.hm_universal_latex = firstNonEmpty(row.hm_universal_latex, row.universal_hm_latex, row.hm_universal);
  normalized.hm_universal_unicode = firstNonEmpty(row.hm_universal_unicode, row.universal_hm_unicode, row.hm_universal);

  // Backfill legacy keys so older UI paths continue to work.
  normalized.short_hm_symbol = normalized.hm_short;
  normalized.short_hm_symbol_latex = normalized.hm_short_latex;
  normalized.short_hm_symbol_unicode = normalized.hm_short_unicode;
  normalized.short_hm_symbol_aliases = normalized.hm_short_aliases;
  normalized.short_hm_symbol_aliases_latex = normalized.hm_short_aliases_latex;
  normalized.universal_hm = normalized.hm_universal;
  normalized.universal_hm_latex = normalized.hm_universal_latex;
  normalized.universal_hm_unicode = normalized.hm_universal_unicode;

  return normalized;
};

const normalizeRows = (rows) => rows.map((row) => normalizeRow(row));

const slugifyPointgroupSymbol = (symbol) => {
  let text = String(symbol || "").trim().toLowerCase();
  if (!text) {
    return "pointgroup";
  }
  if (text.startsWith("-")) {
    text = `neg-${text.slice(1)}`;
  }
  text = text.replace(/\//g, "-over-");
  text = text.replace(/\*/g, "star");
  text = text.replace(/\"/g, "prime");
  text = text.replace(/\s+/g, "-");
  text = text.replace(/[^a-z0-9-]/g, "-");
  text = text.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return text || "pointgroup";
};

const normalizePointgroupRow = (row) => {
  const normalized = { ...row };
  normalized.pointgroup_key = firstNonEmpty(row.pointgroup_key, row.hm_symbol);
  normalized.hm_symbol = firstNonEmpty(row.hm_symbol, row.pointgroup_key);
  normalized.schoenflies = firstNonEmpty(row.schoenflies);
  normalized.schoenflies_unicode = firstNonEmpty(row.schoenflies_unicode, row.schoenflies);
  normalized.schoenflies_latex = firstNonEmpty(row.schoenflies_latex, row.schoenflies);
  normalized.crystal_system = firstNonEmpty(row.crystal_system);
  normalized.laue_class = firstNonEmpty(row.laue_class);
  normalized.order = toMaybeNumber(row.order);
  normalized.n_conjugacy_classes = toMaybeNumber(row.n_conjugacy_classes);
  normalized.is_centrosymmetric = Boolean(row.is_centrosymmetric);
  normalized.slug = firstNonEmpty(row.slug);
  return normalized;
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

const normalizeDatasetMode = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === DATASET_SPACEGROUPS || normalized === DATASET_POINTGROUPS) {
    return normalized;
  }
  return null;
};

const inferDatasetFromPath = () => {
  const path = window.location.pathname || "/";
  if (path.includes("/pointgroup/")) {
    return DATASET_POINTGROUPS;
  }
  return DATASET_SPACEGROUPS;
};

const getModeFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    return normalizeSettingsMode(url.searchParams.get(SETTINGS_QUERY_KEY));
  } catch {
    return null;
  }
};

const getDatasetFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    return normalizeDatasetMode(url.searchParams.get(DATASET_QUERY_KEY));
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

const getDatasetFromStorage = () => {
  try {
    return normalizeDatasetMode(window.localStorage.getItem(DATASET_STORAGE_KEY));
  } catch {
    return null;
  }
};

const sortState = { key: "ita_number", direction: "asc" };
let allRows = [];
let pointgroupRows = [];
let filteredRows = [];
let settingsMode = getModeFromUrl() || getModeFromStorage() || SETTINGS_ITA;
let activeDataset = getDatasetFromUrl() || getDatasetFromStorage() || inferDatasetFromPath();
let sectionState = {
  symops: getSectionOpenFromUrl(SYMOPS_QUERY_KEY, true),
  wyckoff: getSectionOpenFromUrl(WYCKOFF_QUERY_KEY, true),
  max_subgroups: getSectionOpenFromUrl(MAX_SUBGROUPS_QUERY_KEY, true),
  min_supergroups: getSectionOpenFromUrl(MIN_SUPERGROUPS_QUERY_KEY, true),
  normalizer: getSectionOpenFromUrl(NORMALIZER_QUERY_KEY, true),
  k_subgroups: getSectionOpenFromUrl(K_SUBGROUPS_QUERY_KEY, true)
};

const SECTION_QUERY_KEYS = {
  symops: SYMOPS_QUERY_KEY,
  wyckoff: WYCKOFF_QUERY_KEY,
  max_subgroups: MAX_SUBGROUPS_QUERY_KEY,
  min_supergroups: MIN_SUPERGROUPS_QUERY_KEY,
  normalizer: NORMALIZER_QUERY_KEY,
  k_subgroups: K_SUBGROUPS_QUERY_KEY
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
  if (path.includes("/pointgroup/")) {
    return path.split("/pointgroup/")[0] + "/";
  }
  return path.endsWith("/") ? path : path.replace(/[^/]+$/, "");
};

const readJsonResponse = async (response, source) => {
  if (!response.ok) {
    throw new Error(`Failed to load ${source} (${response.status})`);
  }

  const isGzipSource = source.endsWith(".gz");
  const contentEncoding = String(response.headers.get("content-encoding") || "").toLowerCase();
  if (!isGzipSource || contentEncoding.includes("gzip")) {
    return response.json();
  }

  if (typeof DecompressionStream !== "function" || !response.body) {
    throw new Error(`Browser cannot decompress gzip response for ${source}`);
  }

  const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  return JSON.parse(text);
};

const withNavigationQuery = (targetPath, mode, dataset = activeDataset) => {
  const activeMode = normalizeSettingsMode(mode) || SETTINGS_ALL;
  const activeDatasetMode = normalizeDatasetMode(dataset) || DATASET_SPACEGROUPS;
  const url = new URL(targetPath, window.location.origin);
  url.searchParams.set(SETTINGS_QUERY_KEY, activeMode);
  url.searchParams.set(DATASET_QUERY_KEY, activeDatasetMode);
  Object.entries(SECTION_QUERY_KEYS).forEach(([key, queryKey]) => {
    url.searchParams.set(queryKey, sectionState[key] ? QUERY_VALUE_OPEN : QUERY_VALUE_CLOSED);
  });
  return `${url.pathname}${url.search}`;
};

const buildHallUrl = (baseUrl, hallKey, mode = settingsMode) => {
  const rawPath = `${baseUrl}hall/${encodeURIComponent(hallKey)}/`;
  return withNavigationQuery(rawPath, mode, DATASET_SPACEGROUPS);
};

const buildPointgroupUrl = (baseUrl, slug) => {
  const rawPath = `${baseUrl}pointgroup/${encodeURIComponent(slug)}/`;
  return withNavigationQuery(rawPath, settingsMode, DATASET_POINTGROUPS);
};

const buildRootUrl = (baseUrl, mode = settingsMode, dataset = activeDataset) => {
  return withNavigationQuery(baseUrl, mode, dataset);
};

const syncModeUrlAndStorage = () => {
  const normalizedMode = normalizeSettingsMode(settingsMode) || SETTINGS_ALL;
  const normalizedDataset = normalizeDatasetMode(activeDataset) || DATASET_SPACEGROUPS;
  settingsMode = normalizedMode;
  activeDataset = normalizedDataset;

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, normalizedMode);
  } catch {
    // Ignore storage failures.
  }

  try {
    window.localStorage.setItem(DATASET_STORAGE_KEY, normalizedDataset);
  } catch {
    // Ignore storage failures.
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set(SETTINGS_QUERY_KEY, normalizedMode);
    url.searchParams.set(DATASET_QUERY_KEY, normalizedDataset);
    Object.entries(SECTION_QUERY_KEYS).forEach(([key, queryKey]) => {
      url.searchParams.set(queryKey, sectionState[key] ? QUERY_VALUE_OPEN : QUERY_VALUE_CLOSED);
    });
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

const renderInlineLatex = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return escapeHtml(formatValue(value));
  }
  return `<span class="math-content">\\(${escapeHtml(String(value))}\\)</span>`;
};

const getArrayValues = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item) => item !== null && item !== undefined && String(item).trim() !== "");
};

const renderHmWithAliases = (row) => {
  const shortLatex = firstNonEmpty(row.hm_short_latex, row.short_hm_symbol_latex);
  const baseLabel = shortLatex
    ? renderInlineLatex(shortLatex)
    : escapeHtml(formatValue(row.hm_short_unicode || row.hm_short || row.short_hm_symbol));
  const aliasesLatex = getArrayValues(row.hm_short_aliases_latex || row.short_hm_symbol_aliases_latex);
  const aliasesUnicode = getArrayValues(row.hm_short_aliases_unicode);
  const aliasesPlain = getArrayValues(row.hm_short_aliases || row.short_hm_symbol_aliases);
  const aliases = aliasesLatex.length ? aliasesLatex : aliasesUnicode.length ? aliasesUnicode : aliasesPlain;
  if (!aliases.length) {
    return baseLabel;
  }
  const aliasLabel = aliasesLatex.length
    ? aliases.map((item) => renderInlineLatex(item)).join(", ")
    : aliases.map((item) => escapeHtml(formatValue(item))).join(", ");
  return `${baseLabel} (${aliasLabel})`;
};

const renderHallWithLatex = (row) => {
  const hallLatex = firstNonEmpty(row.hall_latex);
  if (hallLatex) {
    return renderInlineLatex(hallLatex);
  }
  return escapeHtml(formatValue(row.hall_unicode || row.hall_entry || row.hall_key));
};

const renderPointgroupSymbol = (row) => {
  return escapeHtml(formatValue(row.hm_symbol || row.pointgroup_key));
};

const renderPointgroupSchoenflies = (row) => {
  return renderMaybeMath(row.schoenflies_unicode || row.schoenflies || row.schoenflies_latex);
};

const TABLE_CONFIGS = {
  [DATASET_SPACEGROUPS]: {
    ariaLabel: "Spacegroup table",
    searchPlaceholder: "Hall symbol, HM symbol, ITA, n:c, crystal system...",
    emptyLabel: "spacegroups",
    defaultSortKey: "ita_number",
    columns: [
      { key: "short_hm_symbol", label: "Hermann-Mauguin", render: (row) => renderHmWithAliases(row) },
      { key: "ita_number", label: "ITA #", render: (row) => escapeHtml(formatValue(row.ita_number)) },
      { key: "hall_key", label: "Hall Symbol", render: (row) => renderHallWithLatex(row) },
      { key: "crystal_system", label: "Crystal System", muted: true, render: (row) => escapeHtml(formatValue(row.crystal_system)) },
      { key: "point_group", label: "Point Group", muted: true, render: (row) => escapeHtml(formatValue(row.point_group)) },
      { key: "n_c", label: "n:c", muted: true, render: (row) => escapeHtml(formatValue(row.n_c)) }
    ],
    rowUrl: (baseUrl, row) => buildHallUrl(baseUrl, row.hall_key)
  },
  [DATASET_POINTGROUPS]: {
    ariaLabel: "Pointgroup table",
    searchPlaceholder: "Point group symbol, Schoenflies, crystal system, laue class...",
    emptyLabel: "pointgroups",
    defaultSortKey: "hm_symbol",
    columns: [
      { key: "hm_symbol", label: "Point Group", render: (row) => renderPointgroupSymbol(row) },
      { key: "schoenflies_unicode", label: "Schoenflies", render: (row) => renderPointgroupSchoenflies(row) },
      { key: "crystal_system", label: "Crystal System", muted: true, render: (row) => escapeHtml(formatValue(row.crystal_system)) },
      { key: "laue_class", label: "Laue Class", muted: true, render: (row) => escapeHtml(formatValue(row.laue_class)) },
      { key: "order", label: "Order", muted: true, render: (row) => escapeHtml(formatValue(row.order)) },
      {
        key: "n_conjugacy_classes",
        label: "Conj. Classes",
        muted: true,
        render: (row) => escapeHtml(formatValue(row.n_conjugacy_classes))
      }
    ],
    rowUrl: (baseUrl, row) => buildPointgroupUrl(baseUrl, row.slug || slugifyPointgroupSymbol(row.hm_symbol || row.pointgroup_key))
  }
};

const getActiveTableConfig = () => {
  return TABLE_CONFIGS[activeDataset] || TABLE_CONFIGS[DATASET_SPACEGROUPS];
};

const ensureSortKeyForActiveDataset = (forceDefault = false) => {
  const config = getActiveTableConfig();
  const keys = new Set(config.columns.map((column) => column.key));
  if (forceDefault || !keys.has(sortState.key)) {
    sortState.key = config.defaultSortKey;
    sortState.direction = "asc";
  }
};

const getActiveSourceRows = () => {
  if (activeDataset === DATASET_POINTGROUPS) {
    return pointgroupRows;
  }
  return getRowsForMode(allRows);
};

const filterSpacegroupRows = (rows, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    return rows;
  }

  return rows.filter((item) => {
    const haystack = [
      item.hall_key,
      item.hall_entry,
      item.hall_latex,
      item.hall_unicode,
      item.hm_short,
      Array.isArray(item.hm_short_aliases) ? item.hm_short_aliases.join(" ") : item.hm_short_aliases,
      Array.isArray(item.hm_short_aliases_latex) ? item.hm_short_aliases_latex.join(" ") : item.hm_short_aliases_latex,
      Array.isArray(item.hm_short_aliases_unicode) ? item.hm_short_aliases_unicode.join(" ") : item.hm_short_aliases_unicode,
      item.hm_short_latex,
      item.hm_short_unicode,
      item.hm_full,
      item.hm_full_latex,
      item.hm_full_unicode,
      item.hm_extended,
      item.hm_extended_latex,
      item.hm_extended_unicode,
      item.hm_universal,
      Array.isArray(item.hm_universal_aliases) ? item.hm_universal_aliases.join(" ") : item.hm_universal_aliases,
      Array.isArray(item.hm_universal_aliases_latex)
        ? item.hm_universal_aliases_latex.join(" ")
        : item.hm_universal_aliases_latex,
      Array.isArray(item.hm_universal_aliases_unicode)
        ? item.hm_universal_aliases_unicode.join(" ")
        : item.hm_universal_aliases_unicode,
      item.hm_universal_latex,
      item.hm_universal_unicode,
      item.short_hm_symbol,
      item.short_hm_symbol_latex,
      item.short_hm_symbol_unicode,
      Array.isArray(item.short_hm_symbol_aliases) ? item.short_hm_symbol_aliases.join(" ") : item.short_hm_symbol_aliases,
      Array.isArray(item.short_hm_symbol_aliases_latex)
        ? item.short_hm_symbol_aliases_latex.join(" ")
        : item.short_hm_symbol_aliases_latex,
      item.universal_hm,
      item.universal_hm_latex,
      item.universal_hm_unicode,
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

const filterPointgroupRows = (rows, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    return rows;
  }

  return rows.filter((item) => {
    const haystack = [
      item.pointgroup_key,
      item.hm_symbol,
      item.schoenflies,
      item.schoenflies_unicode,
      item.schoenflies_latex,
      item.crystal_system,
      item.laue_class,
      item.order,
      item.n_conjugacy_classes,
      item.is_centrosymmetric ? "centrosymmetric" : "non-centrosymmetric"
    ]
      .map((value) => String(value ?? ""))
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
};

const applyFilters = () => {
  const visibleRows = getActiveSourceRows();
  if (!tableView || !searchInput) {
    filteredRows = visibleRows;
    return;
  }

  if (activeDataset === DATASET_POINTGROUPS) {
    filteredRows = filterPointgroupRows(visibleRows, searchInput.value);
    return;
  }
  filteredRows = filterSpacegroupRows(visibleRows, searchInput.value);
};

const updateSummary = () => {
  if (!searchSummary) {
    return;
  }
  const config = getActiveTableConfig();
  const query = searchInput ? searchInput.value.trim() : "";
  if (!query) {
    searchSummary.textContent = `Showing all ${config.emptyLabel}`;
    return;
  }
  searchSummary.textContent = `Query "${query}" returned ${filteredRows.length} result${filteredRows.length === 1 ? "" : "s"}`;
};

const renderTableHeader = () => {
  if (!tableHead) {
    return;
  }
  const config = getActiveTableConfig();
  tableHead.innerHTML = `<tr>${config.columns
    .map((column) => `<th><button class="sort-btn" data-sort="${column.key}">${escapeHtml(column.label)}</button></th>`)
    .join("")}</tr>`;
};

const renderTable = () => {
  if (!tableBody || !emptyState) {
    return;
  }

  const config = getActiveTableConfig();
  renderTableHeader();

  if (indexTable) {
    indexTable.setAttribute("aria-label", config.ariaLabel);
  }

  const baseUrl = resolveBase();
  const rows = sortRows(filteredRows);
  tableBody.innerHTML = rows
    .map((row) => {
      const rowUrl = config.rowUrl(baseUrl, row);
      const cells = config.columns
        .map((column) => {
          const className = column.muted ? ' class="td-muted"' : "";
          return `<td${className}>${column.render(row)}</td>`;
        })
        .join("");
      return `<tr class="sg-row" data-active="false" data-row-url="${escapeHtml(rowUrl)}">${cells}</tr>`;
    })
    .join("");

  emptyState.hidden = rows.length > 0;
  emptyState.textContent = `No matching ${config.emptyLabel} found.`;
  updateSummary();

  if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
    tableBody.classList.add("math-pending");
    window.MathJax.typesetPromise([tableHead || tableBody, tableBody])
      .catch((err) => {
        console.warn("MathJax typeset failed", err);
      })
      .finally(() => {
        tableBody.classList.remove("math-pending");
      });
  }
};

const updateSearchUi = () => {
  if (!tableView) {
    return;
  }
  const config = getActiveTableConfig();
  if (searchInput) {
    searchInput.placeholder = config.searchPlaceholder;
  }
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

const updateDatasetButtons = () => {
  document.querySelectorAll("[data-dataset-toggle]").forEach((button) => {
    button.dataset.dataset = activeDataset;
    button.setAttribute(
      "title",
      activeDataset === DATASET_SPACEGROUPS ? "Table: spacegroups" : "Table: pointgroups"
    );
  });
};

const updateIndexControlVisibility = () => {
  if (!tableView) {
    return;
  }
  if (settingsToggleWrapIndex) {
    settingsToggleWrapIndex.hidden = false;
  }
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
  document.querySelectorAll("a.related-link[href]").forEach((anchor) => {
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
    anchor.setAttribute("href", withNavigationQuery(parsed.pathname, mode, DATASET_SPACEGROUPS));
  });
};

const updateMappingVisibility = () => {
  document.querySelectorAll("[data-mapping-box]").forEach((box) => {
    const tabs = Array.from(box.querySelectorAll("[data-mapping-tab]"));
    const panels = Array.from(box.querySelectorAll("[data-mapping-panel]"));

    const visibleTabs = tabs.filter((tab) => {
      const isReference = tab.getAttribute("data-is-reference-setting") === "true";
      const visible = settingsMode !== SETTINGS_ITA || isReference;
      tab.hidden = !visible;
      tab.style.display = visible ? "" : "none";
      return visible;
    });

    const visiblePanelIds = new Set(
      visibleTabs.map((tab) => tab.getAttribute("data-target-id")).filter(Boolean)
    );

    let activeTargetId = box.getAttribute("data-active-target-id");
    if (!activeTargetId || !visiblePanelIds.has(activeTargetId)) {
      activeTargetId = visibleTabs.length > 0 ? visibleTabs[0].getAttribute("data-target-id") : null;
      if (activeTargetId) {
        box.setAttribute("data-active-target-id", activeTargetId);
      } else {
        box.removeAttribute("data-active-target-id");
      }
    }

    tabs.forEach((tab) => {
      const targetId = tab.getAttribute("data-target-id");
      const isActive = Boolean(targetId) && targetId === activeTargetId && !tab.hidden;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((panel) => {
      const panelId = panel.getAttribute("id");
      const isReference = panel.getAttribute("data-is-reference-setting") === "true";
      const allowedByMode = settingsMode !== SETTINGS_ITA || isReference;
      const isVisiblePanel = Boolean(panelId) && panelId === activeTargetId && visiblePanelIds.has(panelId) && allowedByMode;
      panel.hidden = !isVisiblePanel;
      panel.style.display = isVisiblePanel ? "" : "none";
    });

    const emptyNote = box.querySelector("[data-mapping-empty]");
    if (emptyNote) {
      emptyNote.hidden = !(settingsMode === SETTINGS_ITA && visibleTabs.length === 0);
    }
  });
};

const updateBackButtonHref = () => {
  const backButton = document.querySelector(".header-back-btn");
  if (!backButton) {
    return;
  }
  backButton.setAttribute("href", buildRootUrl(resolveBase(), settingsMode, activeDataset));
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

  document.querySelectorAll("[data-mapping-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const box = tab.closest("[data-mapping-box]");
      const targetId = tab.getAttribute("data-target-id");
      if (!box || !targetId || tab.hidden) {
        return;
      }
      box.setAttribute("data-active-target-id", targetId);
      updateMappingVisibility();
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

      const row = target.closest("tr[data-row-url]");
      if (!row) {
        return;
      }
      const rowUrl = row.getAttribute("data-row-url");
      if (rowUrl) {
        window.location.assign(rowUrl);
      }
    });
  }

  if (tableView) {
    tableView.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const button = target.closest(".sort-btn");
      if (!button) {
        return;
      }
      const key = button.getAttribute("data-sort");
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
  }

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

  document.querySelectorAll("[data-dataset-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDataset = activeDataset === DATASET_SPACEGROUPS ? DATASET_POINTGROUPS : DATASET_SPACEGROUPS;
      ensureSortKeyForActiveDataset(true);
      syncModeUrlAndStorage();
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

const buildPointgroupRows = (data) => {
  let rows = [];

  if (Array.isArray(data)) {
    rows = data.map((row) => normalizePointgroupRow(row));
  } else if (data && typeof data === "object") {
    rows = Object.entries(data).map(([pointgroupKey, entry]) => {
      const rawEntry = entry && typeof entry === "object" ? entry : {};
      return normalizePointgroupRow({
        ...rawEntry,
        pointgroup_key: pointgroupKey,
        hm_symbol: rawEntry.hm_symbol ?? pointgroupKey
      });
    });
  }

  // Ensure every row has a unique slug, even when we loaded fallback raw basics.
  const usedSlugs = new Set();
  rows.forEach((row) => {
    const base = firstNonEmpty(row.slug, slugifyPointgroupSymbol(row.hm_symbol || row.pointgroup_key));
    let slug = String(base);
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    usedSlugs.add(slug);
    row.slug = slug;
  });

  rows.sort((a, b) => {
    const cs = String(a.crystal_system || "").localeCompare(String(b.crystal_system || ""));
    if (cs !== 0) {
      return cs;
    }
    const orderA = a.order ?? 10 ** 9;
    const orderB = b.order ?? 10 ** 9;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return String(a.hm_symbol || a.pointgroup_key || "").localeCompare(String(b.hm_symbol || b.pointgroup_key || ""));
  });

  return rows;
};

const buildLists = (rows) => {
  const hmGroups = new Map();
  const itaGroups = new Map();
  const hmValues = new Set();
  const itaValues = new Set();

  rows.forEach((row) => {
    if (row.hm_universal || row.universal_hm) {
      const key = String(row.hm_universal || row.universal_hm);
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
      hmDisplay[hm] = String(
        selected.hm_full_unicode || selected.hm_full || selected.hm_universal_unicode || selected.hm_universal || hm
      );
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
      const row = allRows.find((item) => item.hall_key === hallKey);
      option.textContent = row ? row.hall_unicode || row.hall_entry || hallKey : hallKey;
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
    ensureSortKeyForActiveDataset();
    updateSearchUi();
    updateIndexControlVisibility();
    applyFilters();
    renderTable();
  }

  updateSettingsButtons();
  updateDatasetButtons();
  updateSectionToggles();
  updateMappingVisibility();
  updateStaticHallLinks();
  updateBackButtonHref();
};

const loadSpacegroupRows = async (baseUrl) => {
  const sources = [INDEX_DATA_PATH, FULL_DATA_PATH];
  for (const source of sources) {
    try {
      const response = await fetch(`${baseUrl}${source}`, { cache: "force-cache" });
      const data = await readJsonResponse(response, source);
      if (Array.isArray(data)) {
        return normalizeRows(data);
      }
      return normalizeRows(buildIndexRows(data));
    } catch (error) {
      console.warn(`Unable to load ${source}`, error);
    }
  }
  return [];
};

const loadPointgroupRows = async (baseUrl) => {
  const sources = [POINTGROUP_INDEX_DATA_PATH, POINTGROUP_BASICS_DATA_PATH];
  for (const source of sources) {
    try {
      const response = await fetch(`${baseUrl}${source}`, { cache: "force-cache" });
      const data = await readJsonResponse(response, source);
      return buildPointgroupRows(data);
    } catch (error) {
      console.warn(`Unable to load ${source}`, error);
    }
  }
  return [];
};

const initIndex = async () => {
  syncModeUrlAndStorage();
  updateSettingsButtons();
  updateDatasetButtons();
  updateBackButtonHref();

  const baseUrl = resolveBase();
  allRows = await loadSpacegroupRows(baseUrl);
  pointgroupRows = await loadPointgroupRows(baseUrl);

  setupEvents();
  refreshUiState();
};

initIndex();
