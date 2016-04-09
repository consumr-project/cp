es_version = 1.7.3

es: elasticsearch
elasticsearch:
	if [ ! -d bin ]; then mkdir bin; fi
	if [ ! -f bin/elasticsearch-$(es_version).zip ]; then \
        wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$(es_version).zip \
            -O bin/elasticsearch-$(es_version).zip; fi
	if [ ! -d bin/elasticsearch-$(es_version) ]; then \
        unzip bin/elasticsearch-$(es_version).zip -d bin/elasticsearch-$(es_version); fi
	bin/elasticsearch-$(es_version)/elasticsearch-$(es_version)/bin/elasticsearch
