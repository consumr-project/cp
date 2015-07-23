.PHONY: build-css

build: build-css

build-css:
	./node_modules/.bin/cssnext app/modules/base/main.css static/site.css \
		--compress --sourcemap
