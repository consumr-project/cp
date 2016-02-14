.PHONY: install clean build

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

test: test-unit test-integration

test-unit: test/src/*
	$(tape) test/src/*.js

test-integration: test/integration/*
	$(tape) test/integration/*
