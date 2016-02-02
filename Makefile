.PHONY: install clean build

es_version = 1.7.3
services = query

typings = ./node_modules/.bin/typings
tsc = ./node_modules/.bin/tsc

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

service:
	node build/service

local:
	-$(foreach service,$(services),rm -r node_modules/$(service)-service;)
	-$(foreach service,$(services),npm link ../$(service)-service;)

es: elasticsearch
elasticsearch:
	if [ ! -d bin ]; then mkdir bin; fi
	if [ ! -f bin/elasticsearch-$(es_version).zip ]; then \
        wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$(es_version).zip \
            -O bin/elasticsearch-$(es_version).zip; fi
	if [ ! -d bin/elasticsearch-$(es_version) ]; then \
        unzip bin/elasticsearch-$(es_version).zip -d bin/elasticsearch-$(es_version); fi
	bin/elasticsearch-$(es_version)/elasticsearch-$(es_version)/bin/elasticsearch
