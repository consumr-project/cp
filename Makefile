.PHONY: build deploy install run

build: build-css

build-css:
	./node_modules/.bin/cssnext app/modules/base/main.css static/site.css \
		--compress --sourcemap

install:
	npm install

deploy:
	git push heroku master

run: build
	node server

run-dev:
	NODE_ENV=development DEBUG=* node server
