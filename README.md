# *httk* Spacegroup Data Explorer (Hugo)

This repository is a Hugo site that replaces the old static website.

## Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version recommended)

## Run locally

Start a local development server with live reload:

```bash
hugo server
```

Then open `http://localhost:1313`.

## Build the site

Generate the production-ready static site:

```bash
hugo
```

By default, Hugo writes the generated files to `public/`.

## Project layout

- `content/_index.md`: homepage content, including embedded index data for the table view
- `content/hall/*.md`: one content file per Hall setting (detail pages)
- `layouts/`: Hugo templates for list/detail rendering
- `data/spacegroup_lists.json`: lookup lists used by selectors/navigation
- `static/`: JS/CSS assets copied directly into the generated site
