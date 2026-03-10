PYTHON ?= python3
HUGO ?= hugo

GENERATOR := scripts/generate_hall_pages.py

.PHONY: generate build serve

generate:
	$(PYTHON) $(GENERATOR)

build: generate
	$(HUGO)

serve: generate
	$(HUGO) server
