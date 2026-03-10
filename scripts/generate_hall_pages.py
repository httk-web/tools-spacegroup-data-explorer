#!/usr/bin/env python3
from __future__ import annotations

import gzip
import json
import re
from fractions import Fraction
from pathlib import Path
from typing import Any, Dict, List

HUGO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = HUGO_ROOT / "static" / "data"
SYMMETRY_BASICS_PATH = DATA_ROOT / "symmetry_basics.json"
POINTGROUP_BASICS_PATH = DATA_ROOT / "pointgroup_basics.json"
BARNIGHAUSEN_PATH = HUGO_ROOT / "static" / "data" / "barnighausen_hall.json"
EUCLIDIAN_NORMALIZER_PATH = DATA_ROOT / "euclidian_normalizer.json"
CONTINUOUS_EUCLIDIAN_NORMALIZER_PATH = DATA_ROOT / "continuous_euclidian_normalizer_hall.json"
CELL_COMMENSURATOR_PATH = DATA_ROOT / "cell_commensurator_hall.json"
CONTENT_ROOT = HUGO_ROOT / "content"
HALL_ROOT = CONTENT_ROOT / "hall"
POINTGROUP_ROOT = CONTENT_ROOT / "pointgroup"

INDEX_FIELDS = [
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
    "n_c",
    "n_c_aliases",
    "crystal_system",
    "point_group",
    "laue_class",
    "qualifier",
    "schoenflies",
    "schoenflies_latex",
    "schoenflies_unicode",
    "is_reference_setting",
]


def _log(message: str) -> None:
    print(f"[generate_hall_pages] {message}", flush=True)


def _first_non_empty(*values: Any) -> Any:
    for value in values:
        if value is None:
            continue
        if isinstance(value, str) and value.strip() == "":
            continue
        return value
    return None


def _resolve_input_path(path: Path) -> Path:
    gz_path = path.with_name(f"{path.name}.gz")
    if gz_path.exists():
        return gz_path
    return path


def _load_json(path: Path) -> Any:
    source = _resolve_input_path(path)
    if not source.exists():
        raise FileNotFoundError(f"Missing {source}")
    if source.suffix == ".gz":
        with gzip.open(source, "rt", encoding="utf-8") as handle:
            return json.load(handle)
    with source.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_json_gz(path: Path, payload: Any) -> None:
    with gzip.open(path, "wt", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=True, indent=2, sort_keys=True)
        handle.write("\n")


def _normalize_entry(hall_key: str, raw_entry: Any) -> Dict[str, Any]:
    entry = dict(raw_entry) if isinstance(raw_entry, dict) else {}

    hall_entry = _first_non_empty(entry.get("hall_entry"), hall_key)
    hall_latex = _first_non_empty(entry.get("hall_latex"), hall_entry)
    hall_unicode = _first_non_empty(entry.get("hall_unicode"), hall_entry)

    hm_short = _first_non_empty(entry.get("hm_short"), entry.get("hm_full"), entry.get("hm_extended"), entry.get("hm_universal"))
    hm_short_aliases = _first_non_empty(entry.get("hm_short_aliases"))
    hm_short_aliases_latex = _first_non_empty(entry.get("hm_short_aliases_latex"), hm_short_aliases)
    hm_short_aliases_unicode = _first_non_empty(entry.get("hm_short_aliases_unicode"), hm_short_aliases)
    hm_short_latex = _first_non_empty(entry.get("hm_short_latex"), hm_short)
    hm_short_unicode = _first_non_empty(entry.get("hm_short_unicode"), hm_short)

    hm_full = _first_non_empty(entry.get("hm_full"), hm_short)
    hm_full_latex = _first_non_empty(entry.get("hm_full_latex"), hm_short_latex, hm_full)
    hm_full_unicode = _first_non_empty(entry.get("hm_full_unicode"), hm_short_unicode, hm_full)

    hm_extended = _first_non_empty(entry.get("hm_extended"), hm_full)
    hm_extended_latex = _first_non_empty(entry.get("hm_extended_latex"), hm_full_latex, hm_extended)
    hm_extended_unicode = _first_non_empty(entry.get("hm_extended_unicode"), hm_full_unicode, hm_extended)

    hm_universal = _first_non_empty(entry.get("hm_universal"), hm_extended)
    hm_universal_aliases = _first_non_empty(entry.get("hm_universal_aliases"))
    hm_universal_aliases_latex = _first_non_empty(entry.get("hm_universal_aliases_latex"), hm_universal_aliases)
    hm_universal_aliases_unicode = _first_non_empty(entry.get("hm_universal_aliases_unicode"), hm_universal_aliases)
    hm_universal_latex = _first_non_empty(entry.get("hm_universal_latex"), hm_extended_latex, hm_universal)
    hm_universal_unicode = _first_non_empty(entry.get("hm_universal_unicode"), hm_extended_unicode, hm_universal)

    n_c_aliases = _first_non_empty(entry.get("n_c_aliases"))

    normalized = dict(entry)
    normalized["hall_key"] = hall_key
    normalized["hall_entry"] = hall_entry
    normalized["hall_latex"] = hall_latex
    normalized["hall_unicode"] = hall_unicode
    normalized["hm_short"] = hm_short
    normalized["hm_short_aliases"] = hm_short_aliases
    normalized["hm_short_aliases_latex"] = hm_short_aliases_latex
    normalized["hm_short_aliases_unicode"] = hm_short_aliases_unicode
    normalized["hm_short_latex"] = hm_short_latex
    normalized["hm_short_unicode"] = hm_short_unicode
    normalized["hm_full"] = hm_full
    normalized["hm_full_latex"] = hm_full_latex
    normalized["hm_full_unicode"] = hm_full_unicode
    normalized["hm_extended"] = hm_extended
    normalized["hm_extended_latex"] = hm_extended_latex
    normalized["hm_extended_unicode"] = hm_extended_unicode
    normalized["hm_universal"] = hm_universal
    normalized["hm_universal_aliases"] = hm_universal_aliases
    normalized["hm_universal_aliases_latex"] = hm_universal_aliases_latex
    normalized["hm_universal_aliases_unicode"] = hm_universal_aliases_unicode
    normalized["hm_universal_latex"] = hm_universal_latex
    normalized["hm_universal_unicode"] = hm_universal_unicode
    normalized["n_c_aliases"] = n_c_aliases

    normalized["schoenflies"] = _first_non_empty(entry.get("schoenflies"))
    normalized["schoenflies_latex"] = _first_non_empty(entry.get("schoenflies_latex"), normalized["schoenflies"])
    normalized["schoenflies_unicode"] = _first_non_empty(entry.get("schoenflies_unicode"), normalized["schoenflies"])

    return normalized


def load_data() -> Dict[str, Dict[str, Any]]:
    _log(f"Loading symmetry basics from {_resolve_input_path(SYMMETRY_BASICS_PATH)}")
    payload = _load_json(SYMMETRY_BASICS_PATH)

    if not isinstance(payload, dict):
        raise TypeError("Expected spacegroup data payload to be an object keyed by hall_key")

    normalized: Dict[str, Dict[str, Any]] = {}
    for raw_hall_key, raw_entry in payload.items():
        hall_key = str(raw_hall_key)
        normalized[hall_key] = _normalize_entry(hall_key, raw_entry)
    return normalized


def _normalize_pointgroup_entry(pointgroup_key: str, raw_entry: Any) -> Dict[str, Any]:
    entry = dict(raw_entry) if isinstance(raw_entry, dict) else {}
    normalized = dict(entry)

    normalized["pointgroup_key"] = pointgroup_key
    normalized["hm_symbol"] = _first_non_empty(entry.get("hm_symbol"), pointgroup_key)
    normalized["crystal_system"] = _first_non_empty(entry.get("crystal_system"))
    normalized["laue_class"] = _first_non_empty(entry.get("laue_class"))
    normalized["schoenflies"] = _first_non_empty(entry.get("schoenflies"))
    normalized["schoenflies_latex"] = _first_non_empty(entry.get("schoenflies_latex"), normalized["schoenflies"])
    normalized["schoenflies_unicode"] = _first_non_empty(entry.get("schoenflies_unicode"), normalized["schoenflies"])

    symops = entry.get("symops")
    normalized["symops"] = symops if isinstance(symops, list) else []

    conjugacy = entry.get("conjugacy_classes")
    normalized["conjugacy_classes"] = conjugacy if isinstance(conjugacy, list) else []

    character_real = entry.get("character_table_real")
    normalized["character_table_real"] = character_real if isinstance(character_real, list) else []

    character_complex = entry.get("character_table_complex")
    normalized["character_table_complex"] = character_complex if isinstance(character_complex, list) else []

    return normalized


def load_pointgroup_data() -> Dict[str, Dict[str, Any]]:
    if not _resolve_input_path(POINTGROUP_BASICS_PATH).exists():
        _log("Pointgroup basics data not found; pointgroup pages and table will be empty")
        return {}
    _log(f"Loading pointgroup basics from {_resolve_input_path(POINTGROUP_BASICS_PATH)}")
    payload = _load_json(POINTGROUP_BASICS_PATH)
    if not isinstance(payload, dict):
        return {}

    normalized: Dict[str, Dict[str, Any]] = {}
    for raw_key, raw_entry in payload.items():
        pointgroup_key = str(raw_key)
        normalized[pointgroup_key] = _normalize_pointgroup_entry(pointgroup_key, raw_entry)
    return normalized


def _pointgroup_slug_base(symbol: str) -> str:
    text = str(symbol).strip().lower()
    if text.startswith("-"):
        text = f"neg-{text[1:]}"
    text = text.replace("/", "-over-")
    text = text.replace("*", "star")
    text = text.replace('"', "prime")
    text = text.replace(" ", "-")
    text = re.sub(r"[^a-z0-9-]", "-", text)
    text = re.sub(r"-{2,}", "-", text).strip("-")
    return text or "pointgroup"


def attach_pointgroup_slugs(pointgroup_data: Dict[str, Dict[str, Any]]) -> Dict[str, str]:
    used_slugs: set[str] = set()
    symbol_to_slug: Dict[str, str] = {}

    for pointgroup_key in sorted(pointgroup_data.keys()):
        base_slug = _pointgroup_slug_base(pointgroup_key)
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1

        used_slugs.add(slug)
        symbol_to_slug[pointgroup_key] = slug

    lookup: Dict[str, str] = {}
    for pointgroup_key, entry in pointgroup_data.items():
        slug = symbol_to_slug[pointgroup_key]
        entry["slug"] = slug
        entry["url"] = f"/pointgroup/{slug}/"

        key_text = str(pointgroup_key).strip()
        if key_text:
            lookup[key_text] = slug

        hm_symbol = str(entry.get("hm_symbol") or "").strip()
        if hm_symbol:
            lookup[hm_symbol] = slug

    return lookup


def build_pointgroup_index_rows(pointgroup_data: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for pointgroup_key, entry in pointgroup_data.items():
        rows.append(
            {
                "pointgroup_key": pointgroup_key,
                "slug": entry.get("slug"),
                "hm_symbol": entry.get("hm_symbol"),
                "schoenflies": entry.get("schoenflies"),
                "schoenflies_latex": entry.get("schoenflies_latex"),
                "schoenflies_unicode": entry.get("schoenflies_unicode"),
                "crystal_system": entry.get("crystal_system"),
                "laue_class": entry.get("laue_class"),
                "order": entry.get("order"),
                "n_conjugacy_classes": entry.get("n_conjugacy_classes"),
                "is_centrosymmetric": bool(entry.get("is_centrosymmetric")),
            }
        )

    rows.sort(
        key=lambda item: (
            str(item.get("crystal_system") or ""),
            item.get("order") if isinstance(item.get("order"), int) else 10**9,
            str(item.get("hm_symbol") or item.get("pointgroup_key") or ""),
        )
    )
    return rows


def build_pointgroup_nav_rows(pointgroup_data: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for pointgroup_key, entry in pointgroup_data.items():
        rows.append(
            {
                "pointgroup_key": pointgroup_key,
                "slug": entry.get("slug"),
                "hm_symbol": entry.get("hm_symbol"),
                "schoenflies_unicode": entry.get("schoenflies_unicode"),
                "crystal_system": entry.get("crystal_system"),
                "order": entry.get("order"),
            }
        )

    rows.sort(
        key=lambda item: (
            str(item.get("crystal_system") or ""),
            item.get("order") if isinstance(item.get("order"), int) else 10**9,
            str(item.get("hm_symbol") or item.get("pointgroup_key") or ""),
        )
    )
    return rows


def load_barnighausen_data() -> Dict[str, Dict[str, Dict[str, Any]]]:
    if not _resolve_input_path(BARNIGHAUSEN_PATH).exists():
        _log("Barnighausen data not found; subgroup mapping tables will be empty")
        return {}
    _log(f"Loading Barnighausen data from {_resolve_input_path(BARNIGHAUSEN_PATH)}")
    payload = _load_json(BARNIGHAUSEN_PATH)
    if not isinstance(payload, dict):
        return {}
    return payload


def load_euclidian_normalizer_data() -> Dict[str, Dict[str, Any]]:
    if not _resolve_input_path(EUCLIDIAN_NORMALIZER_PATH).exists():
        _log("Euclidian normalizer data not found; discrete Euclidian normalizer section will be empty")
        return {}
    _log(f"Loading Euclidian normalizer data from {_resolve_input_path(EUCLIDIAN_NORMALIZER_PATH)}")
    payload = _load_json(EUCLIDIAN_NORMALIZER_PATH)
    if not isinstance(payload, dict):
        return {}
    return payload


def load_continuous_euclidian_normalizer_data() -> Dict[str, Dict[str, Any]]:
    if not _resolve_input_path(CONTINUOUS_EUCLIDIAN_NORMALIZER_PATH).exists():
        _log("Continuous Euclidian normalizer data not found; continuous Euclidian note box will be empty")
        return {}
    _log(f"Loading continuous Euclidian normalizer data from {_resolve_input_path(CONTINUOUS_EUCLIDIAN_NORMALIZER_PATH)}")
    payload = _load_json(CONTINUOUS_EUCLIDIAN_NORMALIZER_PATH)
    if not isinstance(payload, dict):
        return {}
    return payload


def load_cell_commensurator_data() -> Dict[str, Dict[str, Any]]:
    if not _resolve_input_path(CELL_COMMENSURATOR_PATH).exists():
        _log("Cell commensurator data not found; Cell Commensurator section will be empty")
        return {}
    _log(f"Loading cell commensurator data from {_resolve_input_path(CELL_COMMENSURATOR_PATH)}")
    payload = _load_json(CELL_COMMENSURATOR_PATH)
    if not isinstance(payload, dict):
        return {}
    return payload


def choose_standard_setting(entries: List[Dict[str, Any]]) -> Dict[str, Any] | None:
    if not entries:
        return None
    for entry in entries:
        if entry.get("is_reference_setting"):
            return entry
    return entries[0]


def build_index_rows(data: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows = []
    for hall_key, entry in data.items():
        row = {"hall_key": hall_key}
        for field in INDEX_FIELDS:
            if field == "hall_key":
                continue
            row[field] = entry.get(field)
        rows.append(row)

    return sorted(
        rows,
        key=lambda item: (
            item.get("ita_number") if item.get("ita_number") is not None else 0,
            item.get("hall_key", ""),
        ),
    )


def build_related_settings(
    index_rows: List[Dict[str, Any]],
) -> Dict[str, List[Dict[str, Any]]]:
    by_ita: Dict[int, List[Dict[str, Any]]] = {}
    for row in index_rows:
        ita = row.get("ita_number")
        if ita is None:
            continue
        by_ita.setdefault(int(ita), []).append(row)

    related: Dict[str, List[Dict[str, Any]]] = {}
    for ita, rows in by_ita.items():
        group = sorted(
            rows,
            key=lambda item: (
                0 if item.get("is_reference_setting") else 1,
                str(item.get("qualifier") or ""),
                item["hall_key"],
            ),
        )
        for row in group:
            related[row["hall_key"]] = [
                {
                    "hall_key": item["hall_key"],
                    "hall_entry": item.get("hall_entry"),
                    "hall_latex": item.get("hall_latex"),
                    "hall_unicode": item.get("hall_unicode"),
                    "qualifier": item.get("qualifier"),
                    "hm_short": _first_non_empty(item.get("hm_short"), item.get("hm_full"), item.get("hm_universal")),
                    "hm_short_latex": _first_non_empty(item.get("hm_short_latex"), item.get("hm_full_latex"), item.get("hm_short")),
                    "hm_short_unicode": _first_non_empty(item.get("hm_short_unicode"), item.get("hm_full_unicode"), item.get("hm_short")),
                    "hm_short_aliases": _first_non_empty(item.get("hm_short_aliases")),
                    "hm_short_aliases_latex": _first_non_empty(item.get("hm_short_aliases_latex"), item.get("hm_short_aliases")),
                    "hm_short_aliases_unicode": _first_non_empty(item.get("hm_short_aliases_unicode"), item.get("hm_short_aliases")),
                    "hm_universal": _first_non_empty(item.get("hm_universal"), item.get("hm_extended"), item.get("hm_full")),
                    "hm_universal_latex": _first_non_empty(item.get("hm_universal_latex"), item.get("hm_extended_latex"), item.get("hm_universal")),
                    "hm_universal_unicode": _first_non_empty(
                        item.get("hm_universal_unicode"), item.get("hm_extended_unicode"), item.get("hm_universal")
                    ),
                    "is_reference_setting": bool(item.get("is_reference_setting")),
                }
                for item in group
            ]
    return related


def _mapping_with_target_metadata(
    target_hall_key: str,
    mapping: Dict[str, Any],
    data: Dict[str, Dict[str, Any]],
) -> Dict[str, Any]:
    target = data.get(target_hall_key, {})
    return {
        "hall_key": target_hall_key,
        "hall_entry": target.get("hall_entry"),
        "hall_latex": target.get("hall_latex"),
        "hall_unicode": target.get("hall_unicode"),
        "hm_short": _first_non_empty(target.get("hm_short"), target.get("hm_full"), target.get("hm_universal")),
        "hm_short_aliases": _first_non_empty(target.get("hm_short_aliases")),
        "hm_short_aliases_latex": _first_non_empty(target.get("hm_short_aliases_latex"), target.get("hm_short_aliases")),
        "hm_short_aliases_unicode": _first_non_empty(target.get("hm_short_aliases_unicode"), target.get("hm_short_aliases")),
        "hm_short_latex": _first_non_empty(target.get("hm_short_latex"), target.get("hm_full_latex"), target.get("hm_short")),
        "hm_short_unicode": _first_non_empty(
            target.get("hm_short_unicode"), target.get("hm_full_unicode"), target.get("hm_short")
        ),
        "hm_full": _first_non_empty(target.get("hm_full"), target.get("hm_short")),
        "hm_full_latex": _first_non_empty(target.get("hm_full_latex"), target.get("hm_short_latex"), target.get("hm_full")),
        "hm_full_unicode": _first_non_empty(target.get("hm_full_unicode"), target.get("hm_short_unicode"), target.get("hm_full")),
        "hm_extended": _first_non_empty(target.get("hm_extended"), target.get("hm_full")),
        "hm_extended_latex": _first_non_empty(
            target.get("hm_extended_latex"), target.get("hm_full_latex"), target.get("hm_extended")
        ),
        "hm_extended_unicode": _first_non_empty(target.get("hm_extended_unicode"), target.get("hm_full_unicode"), target.get("hm_extended")),
        "hm_universal": _first_non_empty(target.get("hm_universal"), target.get("hm_extended"), target.get("hm_full")),
        "hm_universal_aliases": _first_non_empty(target.get("hm_universal_aliases")),
        "hm_universal_aliases_latex": _first_non_empty(target.get("hm_universal_aliases_latex"), target.get("hm_universal_aliases")),
        "hm_universal_aliases_unicode": _first_non_empty(
            target.get("hm_universal_aliases_unicode"), target.get("hm_universal_aliases")
        ),
        "hm_universal_latex": _first_non_empty(target.get("hm_universal_latex"), target.get("hm_extended_latex"), target.get("hm_universal")),
        "hm_universal_unicode": _first_non_empty(
            target.get("hm_universal_unicode"), target.get("hm_extended_unicode"), target.get("hm_universal")
        ),
        "qualifier": target.get("qualifier"),
        "point_group": target.get("point_group"),
        "schoenflies": target.get("schoenflies"),
        "schoenflies_latex": target.get("schoenflies_latex"),
        "schoenflies_unicode": target.get("schoenflies_unicode"),
        "ita_number": target.get("ita_number"),
        "is_reference_setting": bool(target.get("is_reference_setting")),
        "index": mapping.get("index"),
        "transformation_matrix": mapping.get("transformation_matrix"),
        "origin_shift": mapping.get("origin_shift"),
        "wyckoff_rows": mapping.get("wyckoff_rows"),
    }


def _parse_fraction(value: Any) -> Fraction:
    if isinstance(value, Fraction):
        return value
    if isinstance(value, int):
        return Fraction(value, 1)
    if isinstance(value, float):
        return Fraction(value).limit_denominator(144)
    text = str(value).strip()
    if not text:
        return Fraction(0, 1)
    return Fraction(text)


def _fraction_to_text(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def _format_affine_expression(row: List[Any]) -> str:
    coeffs = [_parse_fraction(v) for v in row[:3]]
    shift = _parse_fraction(row[3] if len(row) > 3 else 0)
    vars_ = ["x", "y", "z"]
    terms: List[str] = []

    for coeff, var in zip(coeffs, vars_):
        if coeff == 0:
            continue
        if coeff == 1:
            terms.append(var)
        elif coeff == -1:
            terms.append(f"-{var}")
        else:
            terms.append(f"{_fraction_to_text(coeff)}*{var}")

    expr = " + ".join(terms) if terms else "0"
    expr = expr.replace("+ -", "- ")

    if shift != 0:
        if shift > 0:
            expr = f"{expr} + {_fraction_to_text(shift)}"
        else:
            expr = f"{expr} - {_fraction_to_text(abs(shift))}"
    return expr


def _build_wyckoff_multiplicity_map(entry: Dict[str, Any] | None) -> Dict[str, str]:
    if not isinstance(entry, dict):
        return {}
    wyckoff = entry.get("wyckoff")
    if not isinstance(wyckoff, dict):
        return {}

    multiplicity_by_label: Dict[str, str] = {}
    for label, payload in wyckoff.items():
        if not isinstance(payload, dict):
            continue
        multiplicity = payload.get("multiplicity")
        if multiplicity is None:
            continue
        label_text = str(label).strip()
        multiplicity_text = str(multiplicity).strip()
        if not label_text or not multiplicity_text:
            continue
        multiplicity_by_label[label_text] = multiplicity_text
    return multiplicity_by_label


def _format_wyckoff_label(label: Any, multiplicity_by_label: Dict[str, str]) -> str:
    label_text = str(label).strip()
    if not label_text:
        return ""
    if label_text[:1].isdigit():
        return label_text
    multiplicity = multiplicity_by_label.get(label_text)
    if not multiplicity:
        return label_text
    return f"{multiplicity}{label_text}"


def _annotate_wyckoff_group_rows(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    annotated = [dict(row) for row in rows]
    idx = 0
    total = len(annotated)
    while idx < total:
        group_key = str(annotated[idx].get("g_wp", ""))
        end = idx + 1
        while end < total and str(annotated[end].get("g_wp", "")) == group_key:
            end += 1
        rowspan = end - idx
        annotated[idx]["g_wp_show"] = True
        annotated[idx]["g_wp_rowspan"] = rowspan
        for j in range(idx + 1, end):
            annotated[j]["g_wp_show"] = False
            annotated[j]["g_wp_rowspan"] = 0
        idx = end
    return annotated


def _build_wyckoff_rows(
    mapping: Dict[str, Any],
    g_multiplicity_by_label: Dict[str, str] | None = None,
    h_multiplicity_by_label: Dict[str, str] | None = None,
) -> List[Dict[str, Any]]:
    g_mult = g_multiplicity_by_label or {}
    h_mult = h_multiplicity_by_label or {}
    wyckoff = mapping.get("wyckoff_splitting")
    if not isinstance(wyckoff, dict):
        return []

    rows: List[Dict[str, Any]] = []
    for g_wp, splits in wyckoff.items():
        if not isinstance(splits, list):
            continue
        for split in splits:
            if not isinstance(split, list) or len(split) < 3:
                continue
            h_wp = split[0]
            h_first_orbit = split[1]
            affine = split[2] if isinstance(split[2], list) else []
            affine_xyz = []
            if isinstance(affine, list):
                for affine_row in affine[:3]:
                    if isinstance(affine_row, list):
                        affine_xyz.append(_format_affine_expression(affine_row))
            rows.append(
                {
                    "g_wp": g_wp,
                    "g_wp_display": _format_wyckoff_label(g_wp, g_mult),
                    "h_wp": h_wp,
                    "h_wp_display": _format_wyckoff_label(h_wp, h_mult),
                    "h_first_orbit_xyz": h_first_orbit,
                    "affine_xyz": affine_xyz,
                }
            )

    rows.sort(key=lambda item: (str(item.get("g_wp", "")), str(item.get("h_wp", "")), str(item.get("h_first_orbit_xyz", ""))))
    return _annotate_wyckoff_group_rows(rows)


def _build_wyckoff_items(entry: Dict[str, Any]) -> List[Dict[str, Any]]:
    wyckoff = entry.get("wyckoff")
    if not isinstance(wyckoff, dict):
        return []

    items: List[Dict[str, Any]] = []
    for label, payload in wyckoff.items():
        if not isinstance(payload, dict):
            continue
        items.append(
            {
                "label": label,
                "multiplicity": payload.get("multiplicity"),
                "sitesym": payload.get("sitesym"),
                "orbit_xyz": payload.get("orbit_xyz"),
            }
        )

    # Keep lowercase labels first; place uppercase labels like "A" after "z".
    items.sort(key=lambda item: (not str(item.get("label", "")).islower(), str(item.get("label", "")).lower(), str(item.get("label", ""))))
    return items


def _format_vector_text(values: List[Any], max_len: int = 3) -> str:
    trimmed = values[:max_len]
    return f"[{', '.join(str(value) for value in trimmed)}]"


def _build_cell_commensurator_items(raw_items: Any, source_entry: Dict[str, Any] | None = None) -> List[Dict[str, Any]]:
    if not isinstance(raw_items, list):
        return []

    source_mult = _build_wyckoff_multiplicity_map(source_entry)

    items: List[Dict[str, Any]] = []
    for raw in raw_items:
        if not isinstance(raw, dict):
            continue

        index = raw.get("index")
        if not isinstance(index, int):
            try:
                index = int(index)
            except (TypeError, ValueError):
                index = None

        matrix = raw.get("transformation_matrix")
        if not isinstance(matrix, list):
            matrix = raw.get("P")
        shift = raw.get("origin_shift")
        if not isinstance(shift, list):
            shift = raw.get("p")

        matrix_rows = [row for row in matrix[:3] if isinstance(row, list)] if isinstance(matrix, list) else []
        shift_values = shift[:3] if isinstance(shift, list) else []

        wyckoff_rows = _build_wyckoff_rows(raw, source_mult, source_mult)
        items.append(
            {
                "index": index,
                "transformation_matrix": matrix_rows,
                "origin_shift": shift_values,
                "transformation_matrix_text": "; ".join(_format_vector_text(row) for row in matrix_rows) if matrix_rows else None,
                "origin_shift_text": _format_vector_text(shift_values) if shift_values else None,
                "wyckoff_rows": wyckoff_rows,
                # Cell commensurator relations are self-relations for the current Hall setting.
                "is_reference_setting": True,
            }
        )

    items.sort(
        key=lambda item: (
            item.get("index") if item.get("index") is not None else 10**9,
            str(item.get("transformation_matrix_text") or ""),
            str(item.get("origin_shift_text") or ""),
        )
    )
    return items


def build_group_mappings(
    data: Dict[str, Dict[str, Any]],
    barnighausen: Dict[str, Dict[str, Any]],
) -> tuple[
    Dict[str, List[Dict[str, Any]]],
    Dict[str, List[Dict[str, Any]]],
    Dict[str, List[Dict[str, Any]]],
    Dict[str, List[Dict[str, Any]]],
]:
    outgoing: Dict[str, List[tuple[str, Dict[str, Any]]]] = {}
    incoming: Dict[str, List[tuple[str, Dict[str, Any]]]] = {}
    wyckoff_mult_by_hall = {hall_key: _build_wyckoff_multiplicity_map(entry) for hall_key, entry in data.items()}

    for g_hall, targets in barnighausen.items():
        if not isinstance(targets, dict):
            continue
        for h_hall, raw_mapping in targets.items():
            candidates = raw_mapping if isinstance(raw_mapping, list) else [raw_mapping]
            for mapping in candidates:
                if not isinstance(mapping, dict):
                    continue
                index = mapping.get("index")
                if not isinstance(index, int):
                    try:
                        index = int(index)
                    except (TypeError, ValueError):
                        continue
                normalized = {
                    "index": index,
                    "transformation_matrix": mapping.get("transformation_matrix"),
                    "origin_shift": mapping.get("origin_shift"),
                    "wyckoff_rows": _build_wyckoff_rows(
                        mapping,
                        wyckoff_mult_by_hall.get(g_hall, {}),
                        wyckoff_mult_by_hall.get(h_hall, {}),
                    ),
                }
                outgoing.setdefault(g_hall, []).append((h_hall, normalized))
                incoming.setdefault(h_hall, []).append((g_hall, normalized))

    def dedupe_edges(edges: List[tuple[str, Dict[str, Any]]]) -> List[tuple[str, Dict[str, Any]]]:
        by_other: Dict[str, Dict[str, Any]] = {}
        for other_hall, mapping in edges:
            existing = by_other.get(other_hall)
            if existing is None or mapping["index"] < existing["index"]:
                by_other[other_hall] = mapping
        return [(other_hall, by_other[other_hall]) for other_hall in sorted(by_other.keys())]

    def same_ita(hall_key: str, other_hall_key: str) -> bool:
        hall_ita = data.get(hall_key, {}).get("ita_number")
        other_ita = data.get(other_hall_key, {}).get("ita_number")
        if hall_ita is None or other_ita is None:
            return False
        return int(hall_ita) == int(other_ita)

    maximal_subgroup_mappings: Dict[str, List[Dict[str, Any]]] = {}
    minimal_supergroup_mappings: Dict[str, List[Dict[str, Any]]] = {}
    normalizer_transformations: Dict[str, List[Dict[str, Any]]] = {}
    klassengleiche_subgroup_relations: Dict[str, List[Dict[str, Any]]] = {}

    for hall_key in data:
        same_ita_edges = [
            (target_hall, mapping)
            for target_hall, mapping in outgoing.get(hall_key, [])
            if same_ita(hall_key, target_hall)
        ]
        same_ita_edges.sort(key=lambda item: (item[1]["index"], item[0]))

        normalizer_transformations[hall_key] = [
            _mapping_with_target_metadata(target_hall, mapping, data)
            for target_hall, mapping in same_ita_edges
            if mapping["index"] == 1
        ]
        klassengleiche_subgroup_relations[hall_key] = [
            _mapping_with_target_metadata(target_hall, mapping, data)
            for target_hall, mapping in same_ita_edges
            if mapping["index"] != 1
        ]

        out_edges = dedupe_edges(
            [
                (target_hall, mapping)
                for target_hall, mapping in outgoing.get(hall_key, [])
                if not same_ita(hall_key, target_hall)
            ]
        )
        if out_edges:
            selected = [
                _mapping_with_target_metadata(target_hall, mapping, data)
                for target_hall, mapping in out_edges
            ]
            selected.sort(
                key=lambda item: (
                    item.get("ita_number") if isinstance(item.get("ita_number"), int) else 10**9,
                    item.get("index") if isinstance(item.get("index"), int) else 10**9,
                    item["hall_key"],
                )
            )
            maximal_subgroup_mappings[hall_key] = selected
        else:
            maximal_subgroup_mappings[hall_key] = []

        in_edges = dedupe_edges(
            [
                (source_hall, mapping)
                for source_hall, mapping in incoming.get(hall_key, [])
                if not same_ita(hall_key, source_hall)
            ]
        )
        if in_edges:
            selected = [
                _mapping_with_target_metadata(source_hall, mapping, data)
                for source_hall, mapping in in_edges
            ]
            selected.sort(
                key=lambda item: (
                    item.get("ita_number") if isinstance(item.get("ita_number"), int) else 10**9,
                    item.get("index") if isinstance(item.get("index"), int) else 10**9,
                    item["hall_key"],
                )
            )
            minimal_supergroup_mappings[hall_key] = selected
        else:
            minimal_supergroup_mappings[hall_key] = []

    return (
        maximal_subgroup_mappings,
        minimal_supergroup_mappings,
        normalizer_transformations,
        klassengleiche_subgroup_relations,
    )


def write_index_data(index_rows: List[Dict[str, Any]]) -> None:
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    index_path = DATA_ROOT / "spacegroup_index.json"
    _log(f"Writing index data ({len(index_rows)} rows) to {index_path} and {index_path}.gz")
    index_path.write_text(
        json.dumps(index_rows, ensure_ascii=True, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    _write_json_gz(index_path.with_name(f"{index_path.name}.gz"), index_rows)


def write_pointgroup_index_data(pointgroup_index_rows: List[Dict[str, Any]]) -> None:
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    index_path = DATA_ROOT / "pointgroup_index.json"
    _log(f"Writing pointgroup index data ({len(pointgroup_index_rows)} rows) to {index_path} and {index_path}.gz")
    index_path.write_text(
        json.dumps(pointgroup_index_rows, ensure_ascii=True, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    _write_json_gz(index_path.with_name(f"{index_path.name}.gz"), pointgroup_index_rows)


def write_index_content(index_rows: List[Dict[str, Any]]) -> None:
    CONTENT_ROOT.mkdir(parents=True, exist_ok=True)
    _log(f"Writing index content to {CONTENT_ROOT / '_index.md'}")
    content = """---
title: "Spacegroup Data Explorer"
---
"""

    (CONTENT_ROOT / "_index.md").write_text(content, encoding="utf-8")

    legacy_index = CONTENT_ROOT / "index.md"
    if legacy_index.exists():
        legacy_index.unlink()


def write_pointgroup_index_content() -> None:
    POINTGROUP_ROOT.mkdir(parents=True, exist_ok=True)
    _log(f"Writing pointgroup index content to {POINTGROUP_ROOT / '_index.md'}")
    content = """---
title: "Pointgroup Data Explorer"
---
"""
    (POINTGROUP_ROOT / "_index.md").write_text(content, encoding="utf-8")


def write_pointgroup_pages(
    pointgroup_data: Dict[str, Dict[str, Any]],
    pointgroup_nav: List[Dict[str, Any]],
) -> None:
    POINTGROUP_ROOT.mkdir(parents=True, exist_ok=True)
    total = len(pointgroup_data)
    _log(f"Writing {total} pointgroup detail pages to {POINTGROUP_ROOT}")

    # Sort consistently with the index table.
    ordered = sorted(
        pointgroup_data.items(),
        key=lambda item: (
            str(item[1].get("crystal_system") or ""),
            item[1].get("order") if isinstance(item[1].get("order"), int) else 10**9,
            str(item[1].get("hm_symbol") or item[0]),
        ),
    )
    for idx, (pointgroup_key, entry) in enumerate(ordered, start=1):
        slug = str(entry.get("slug") or pointgroup_key)
        payload: Dict[str, Any] = {
            "title": f"Pointgroup {entry.get('hm_symbol') or pointgroup_key}",
            "pointgroup_key": pointgroup_key,
            "slug": slug,
            "url": f"/pointgroup/{slug}/",
        }
        payload.update(entry)
        payload["pointgroup_nav"] = pointgroup_nav

        json_text = json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True)
        (POINTGROUP_ROOT / f"{slug}.md").write_text(f"{json_text}\n", encoding="utf-8")
        if idx % 20 == 0 or idx == total:
            _log(f"  wrote {idx}/{total} pointgroup pages")


def write_hall_pages(
    data: Dict[str, Dict[str, Any]],
    euclidian_normalizer_data: Dict[str, Dict[str, Any]],
    continuous_euclidian_normalizer_data: Dict[str, Dict[str, Any]],
    cell_commensurator_data: Dict[str, Dict[str, Any]],
    pointgroup_slug_lookup: Dict[str, str],
    related_settings: Dict[str, List[Dict[str, Any]]],
    maximal_subgroup_mappings: Dict[str, List[Dict[str, Any]]],
    minimal_supergroup_mappings: Dict[str, List[Dict[str, Any]]],
    normalizer_transformations: Dict[str, List[Dict[str, Any]]],
    klassengleiche_subgroup_relations: Dict[str, List[Dict[str, Any]]],
) -> None:
    HALL_ROOT.mkdir(parents=True, exist_ok=True)
    total = len(data)
    _log(f"Writing {total} Hall detail pages to {HALL_ROOT}")

    for idx, (hall_key, entry) in enumerate(data.items(), start=1):
        payload: Dict[str, Any] = {
            "title": f"Spacegroup {hall_key}",
            "hall_key": hall_key,
            "slug": hall_key,
            "url": f"/hall/{hall_key}/",
        }
        payload.update(entry)
        payload["wyckoff_items"] = _build_wyckoff_items(entry)
        payload["related_settings"] = related_settings.get(hall_key, [])
        payload["maximal_subgroup_mappings"] = maximal_subgroup_mappings.get(hall_key, [])
        payload["minimal_supergroup_mappings"] = minimal_supergroup_mappings.get(hall_key, [])
        payload["normalizer_transformations"] = normalizer_transformations.get(hall_key, [])
        payload["klassengleiche_subgroup_relations"] = klassengleiche_subgroup_relations.get(hall_key, [])
        payload["euclidian_normalizer"] = (euclidian_normalizer_data.get(hall_key) or {}).get("euclidian_normalizer")
        payload["continuous_euclidian_normalizer"] = (
            (continuous_euclidian_normalizer_data.get(hall_key) or {}).get("continuous_euclidian_normalizer")
        )
        point_group_symbol = str(payload.get("point_group") or "").strip()
        payload["point_group_slug"] = pointgroup_slug_lookup.get(point_group_symbol)
        payload["cell_commensurator"] = _build_cell_commensurator_items(
            (cell_commensurator_data.get(hall_key) or {}).get("affine_commensurator"),
            entry,
        )

        json_text = json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True)
        content = f"{json_text}\n"
        (HALL_ROOT / f"{hall_key}.md").write_text(content, encoding="utf-8")
        if idx % 100 == 0 or idx == total:
            _log(f"  wrote {idx}/{total} pages")


def main() -> None:
    _log("Starting generation")
    data = load_data()
    _log(f"Loaded {len(data)} Hall entries")
    pointgroup_data = load_pointgroup_data()
    _log(f"Loaded pointgroup basics for {len(pointgroup_data)} pointgroups")
    pointgroup_slug_lookup = attach_pointgroup_slugs(pointgroup_data)
    _log(f"Prepared pointgroup slug lookup ({len(pointgroup_slug_lookup)} symbols)")
    barnighausen = load_barnighausen_data()
    _log(f"Loaded Barnighausen mappings for {len(barnighausen)} source Hall entries")
    euclidian_normalizer_data = load_euclidian_normalizer_data()
    _log(f"Loaded Euclidian normalizer entries for {len(euclidian_normalizer_data)} Hall entries")
    continuous_euclidian_normalizer_data = load_continuous_euclidian_normalizer_data()
    _log(f"Loaded continuous Euclidian normalizer entries for {len(continuous_euclidian_normalizer_data)} Hall entries")
    cell_commensurator_data = load_cell_commensurator_data()
    _log(f"Loaded cell commensurator entries for {len(cell_commensurator_data)} Hall entries")
    index_rows = build_index_rows(data)
    _log(f"Built index rows ({len(index_rows)})")
    pointgroup_index_rows = build_pointgroup_index_rows(pointgroup_data)
    _log(f"Built pointgroup index rows ({len(pointgroup_index_rows)})")
    pointgroup_nav = build_pointgroup_nav_rows(pointgroup_data)
    _log(f"Built pointgroup nav rows ({len(pointgroup_nav)})")
    related_settings = build_related_settings(index_rows)
    _log(f"Built related settings map ({len(related_settings)} keys)")
    (
        maximal_subgroup_mappings,
        minimal_supergroup_mappings,
        normalizer_transformations,
        klassengleiche_subgroup_relations,
    ) = build_group_mappings(data, barnighausen)
    _log("Built subgroup/supergroup/normalizer relation maps")

    write_index_content(index_rows)
    write_index_data(index_rows)
    write_pointgroup_index_content()
    write_pointgroup_index_data(pointgroup_index_rows)
    write_pointgroup_pages(pointgroup_data, pointgroup_nav)
    write_hall_pages(
        data,
        euclidian_normalizer_data,
        continuous_euclidian_normalizer_data,
        cell_commensurator_data,
        pointgroup_slug_lookup,
        related_settings,
        maximal_subgroup_mappings,
        minimal_supergroup_mappings,
        normalizer_transformations,
        klassengleiche_subgroup_relations,
    )
    _log("Generation complete")


if __name__ == "__main__":
    main()
