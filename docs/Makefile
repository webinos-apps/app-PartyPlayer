# Makefile for documentation generation
#
# Depends on: jsdoc, plantuml, markdown, pandoc
# Runs on linux, probably on OS-X and perhaps under Windows w/ cygwin
#
# Author: Victor Klos

PLANTUML := $(shell which plantuml)
PWD := $(shell pwd)

IMAGE_DIR := generated/figures
JSDOC_DIR := generated/apidoc

PLANTUML_CMD := $(PLANTUML) -Smonochrome=true -o $(PWD)/$(IMAGE_DIR)
.PHONY: docs figures apidoc

default: docs

docs: figures apidoc design

figures:
	-@mkdir -p $(IMAGE_DIR)
	@find ../apps -name \*.js -print0 | xargs -0 -L 1 $(PLANTUML_CMD)

apidoc:
	-@mkdir -p $(JSDOC_DIR)
	@jsdoc -d=$(PWD)/$(JSDOC_DIR) -p -r=10 --exclude=jquery\* ../apps 

design:
	@markdown design.md > generated/design.html
# TODO: PDF documentation through markdown and pandoc
