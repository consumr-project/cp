es_version = 1.7.3

run: install service

clean:
	-rm -r node_modules
	-rm -r build

install:
	npm install

service:
	node service

es: elasticsearch
elasticsearch:
	if [ ! -d build ]; then mkdir build; fi
	if [ ! -f build/elasticsearch-$(es_version).zip ]; then \
        wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$(es_version).zip \
            -O build/elasticsearch-$(es_version).zip; fi
	if [ ! -d build/elasticsearch-$(es_version) ]; then \
        unzip build/elasticsearch-$(es_version).zip -d build/elasticsearch-$(es_version); fi
	build/elasticsearch-$(es_version)/elasticsearch-$(es_version)/bin/elasticsearch
