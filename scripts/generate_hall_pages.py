#!/usr/bin/env python3
from __future__ import annotations

import gzip
import json
from fractions import Fraction
from pathlib import Path
from typing import Any, Dict, List

HUGO_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = HUGO_ROOT / "static" / "data" / "spacegroup_data.json"
BARNIGHAUSEN_PATH = HUGO_ROOT / "static" / "data" / "barnighausen_hall.json"
CONTENT_ROOT = HUGO_ROOT / "content"
HALL_ROOT = CONTENT_ROOT / "hall"
DATA_ROOT = HUGO_ROOT / "static" / "data"

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
    "is_reference_setting",
]


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


def load_data() -> Dict[str, Dict[str, Any]]:
    return _load_json(DATA_PATH)


def load_barnighausen_data() -> Dict[str, Dict[str, Dict[str, Any]]]:
    if not _resolve_input_path(BARNIGHAUSEN_PATH).exists():
        return {}
    payload = _load_json(BARNIGHAUSEN_PATH)
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
                    "hm_universal": _first_non_empty(item.get("hm_universal"), item.get("universal_hm")),
                    "hm_universal_latex": _first_non_empty(item.get("hm_universal_latex"), item.get("universal_hm_latex")),
                    "hm_universal_unicode": _first_non_empty(item.get("hm_universal_unicode"), item.get("universal_hm_unicode")),
                    "universal_hm": _first_non_empty(item.get("universal_hm"), item.get("hm_universal")),
                    "universal_hm_latex": _first_non_empty(item.get("universal_hm_latex"), item.get("hm_universal_latex")),
                    "universal_hm_unicode": _first_non_empty(item.get("universal_hm_unicode"), item.get("hm_universal_unicode")),
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
        "hm_short": _first_non_empty(target.get("hm_short"), target.get("short_hm_symbol")),
        "hm_short_aliases": _first_non_empty(target.get("hm_short_aliases"), target.get("short_hm_symbol_aliases")),
        "hm_short_aliases_latex": _first_non_empty(
            target.get("hm_short_aliases_latex"), target.get("short_hm_symbol_aliases_latex")
        ),
        "hm_short_aliases_unicode": _first_non_empty(
            target.get("hm_short_aliases_unicode"), target.get("hm_short_aliases"), target.get("short_hm_symbol_aliases")
        ),
        "hm_short_latex": _first_non_empty(target.get("hm_short_latex"), target.get("short_hm_symbol_latex")),
        "hm_short_unicode": _first_non_empty(target.get("hm_short_unicode"), target.get("short_hm_symbol_unicode")),
        "hm_universal": _first_non_empty(target.get("hm_universal"), target.get("universal_hm")),
        "hm_universal_aliases": _first_non_empty(target.get("hm_universal_aliases")),
        "hm_universal_aliases_latex": _first_non_empty(target.get("hm_universal_aliases_latex"), target.get("hm_universal_aliases")),
        "hm_universal_aliases_unicode": _first_non_empty(
            target.get("hm_universal_aliases_unicode"), target.get("hm_universal_aliases")
        ),
        "hm_universal_latex": _first_non_empty(target.get("hm_universal_latex"), target.get("universal_hm_latex")),
        "hm_universal_unicode": _first_non_empty(target.get("hm_universal_unicode"), target.get("universal_hm_unicode")),
        "short_hm_symbol": _first_non_empty(target.get("short_hm_symbol"), target.get("hm_short")),
        "short_hm_symbol_aliases": _first_non_empty(target.get("short_hm_symbol_aliases"), target.get("hm_short_aliases")),
        "short_hm_symbol_aliases_latex": _first_non_empty(
            target.get("short_hm_symbol_aliases_latex"), target.get("hm_short_aliases_latex")
        ),
        "short_hm_symbol_latex": _first_non_empty(target.get("short_hm_symbol_latex"), target.get("hm_short_latex")),
        "short_hm_symbol_unicode": _first_non_empty(target.get("short_hm_symbol_unicode"), target.get("hm_short_unicode")),
        "universal_hm": _first_non_empty(target.get("universal_hm"), target.get("hm_universal")),
        "universal_hm_latex": _first_non_empty(target.get("universal_hm_latex"), target.get("hm_universal_latex")),
        "universal_hm_unicode": _first_non_empty(target.get("universal_hm_unicode"), target.get("hm_universal_unicode")),
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


def _build_wyckoff_rows(mapping: Dict[str, Any]) -> List[Dict[str, Any]]:
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
                    "h_wp": h_wp,
                    "h_first_orbit_xyz": h_first_orbit,
                    "affine_xyz": affine_xyz,
                }
            )

    rows.sort(key=lambda item: (str(item.get("g_wp", "")), str(item.get("h_wp", "")), str(item.get("h_first_orbit_xyz", ""))))
    return rows


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
                    "wyckoff_rows": _build_wyckoff_rows(mapping),
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
            min_index = min(edge[1]["index"] for edge in out_edges)
            selected = [
                _mapping_with_target_metadata(target_hall, mapping, data)
                for target_hall, mapping in out_edges
                if mapping["index"] == min_index
            ]
            selected.sort(key=lambda item: item["hall_key"])
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
            min_index = min(edge[1]["index"] for edge in in_edges)
            selected = [
                _mapping_with_target_metadata(source_hall, mapping, data)
                for source_hall, mapping in in_edges
                if mapping["index"] == min_index
            ]
            selected.sort(key=lambda item: item["hall_key"])
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
    index_path.write_text(
        json.dumps(index_rows, ensure_ascii=True, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    _write_json_gz(index_path.with_name(f"{index_path.name}.gz"), index_rows)


def write_index_content(index_rows: List[Dict[str, Any]]) -> None:
    CONTENT_ROOT.mkdir(parents=True, exist_ok=True)
    content = """---
title: "Spacegroup Data Explorer"
---
"""

    (CONTENT_ROOT / "_index.md").write_text(content, encoding="utf-8")

    legacy_index = CONTENT_ROOT / "index.md"
    if legacy_index.exists():
        legacy_index.unlink()


def write_hall_pages(
    data: Dict[str, Dict[str, Any]],
    related_settings: Dict[str, List[Dict[str, Any]]],
    maximal_subgroup_mappings: Dict[str, List[Dict[str, Any]]],
    minimal_supergroup_mappings: Dict[str, List[Dict[str, Any]]],
    normalizer_transformations: Dict[str, List[Dict[str, Any]]],
    klassengleiche_subgroup_relations: Dict[str, List[Dict[str, Any]]],
) -> None:
    HALL_ROOT.mkdir(parents=True, exist_ok=True)

    for hall_key, entry in data.items():
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

        json_text = json.dumps(payload, ensure_ascii=True, indent=2, sort_keys=True)
        content = f"{json_text}\n"
        (HALL_ROOT / f"{hall_key}.md").write_text(content, encoding="utf-8")


def main() -> None:
    data = load_data()
    barnighausen = load_barnighausen_data()
    index_rows = build_index_rows(data)
    related_settings = build_related_settings(index_rows)
    (
        maximal_subgroup_mappings,
        minimal_supergroup_mappings,
        normalizer_transformations,
        klassengleiche_subgroup_relations,
    ) = build_group_mappings(data, barnighausen)

    write_index_content(index_rows)
    write_index_data(index_rows)
    write_hall_pages(
        data,
        related_settings,
        maximal_subgroup_mappings,
        minimal_supergroup_mappings,
        normalizer_transformations,
        klassengleiche_subgroup_relations,
    )


if __name__ == "__main__":
    main()
