.PHONY: install clean build

services = query

typings = ./node_modules/.bin/typings
tsc = ./node_modules/.bin/tsc
tape = ./node_modules/.bin/tape

dir_source = src
dir_build = build

build:
	$(tsc) config/typings.d.ts $(dir_source)/*  --outDir $(dir_build) \
		--module commonjs --pretty --removeComments --moduleResolution classic

clean:
	-rm -r node_modules typings

install:
	npm install
	$(typings) install

local:
	-$(foreach service,$(services),rm -r node_modules/$(service)-service;)
	-$(foreach service,$(services),npm link ../$(service)-service;)

test: test/integration/*
	$(tape) test/integration/*
