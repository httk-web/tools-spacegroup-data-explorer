# *httk* Spacegroup Data Explorer (Hugo)

This repository is a Hugo site that replaces the old static website.

## Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version recommended)

## Run locally

Start a local development server with live reload:

```bash
make serve
```

Then open `http://localhost:1313`.

## Build the site

Generate the content pages and production-ready static site:

```bash
make build
```

By default, Hugo writes the generated files to `public/`.

## Project layout

- `static/data/symmetry_basics.json.gz`: current space-group and point-group basics dataset
- `static/data/transformations_hm_entry.json.gz`: current H-M-entry keyed transformations dataset
- `static/data/spacegroup_index.json.gz`: generated lightweight browser index derived from `symmetry_basics.json.gz`
- `static/data/pointgroup_index.json.gz`: generated lightweight browser index derived from `symmetry_basics.json.gz`
- `content/_index.md`: homepage content
- `content/hall/*.md`: generated content file per Hall setting (detail pages)
- `layouts/`: Hugo templates for list/detail rendering
- `static/`: JS/CSS assets copied directly into the generated site
