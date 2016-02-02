.PHONY: install clean build

typings = ./node_modules/.bin/typings
tsc = ./node_modules/.bin/tsc

dir_source = src
dir_build = build

clean:
	-rm -r node_modules typings

install:
	npm install
	$(typings) install

build:
	$(tsc) config/typings.d.ts $(dir_source)/*  --outDir $(dir_build) \
		--module commonjs --pretty --removeComments --moduleResolution classic
