#
# This file is part of webinos platform.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# (C) Copyright 2012, TNO
#
# Author Victor Klos
#
# Makefile for documentation generation
#
# Depends on: jsdoc, plantuml, markdown, pandoc
# Runs on linux, probably on OS-X and perhaps under Windows w/ cygwin
#

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
	@jsdoc -d=$(PWD)/$(JSDOC_DIR) -t=$(PWD)/codeview-1-2-1 -p -r=10 --exclude=jquery\* ../apps 

design:
	@markdown design.md > generated/design.html
# TODO: PDF documentation through markdown and pandoc
