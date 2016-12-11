.PHONY: build install run test clean

build_dir = build
build_bundle_js = $(build_dir)/bundle.js
build_client_js = $(build_dir)/client.js
build_vendor_js = $(build_dir)/vendor.js
build_css = $(build_dir)/site.css

npm = npm
tsc = ./node_modules/.bin/tsc
ts_lint = ./node_modules/.bin/tslint
json_lint = ./node_modules/.bin/jsonlint-cli
imageoptim = imageoptim
svgo = svgo
browserify = ./node_modules/.bin/browserify
js_hint = ./node_modules/.bin/jshint
js_min = ./node_modules/.bin/uglifyjs
js_sep = echo ";\n"

ts_options =
browserify_options = --external aws4 \
	--ignore unicode/category/So \
	--full-paths

global_config_varname = TCP_BUILD_CONFIG
i18n_varname = i18n
i18n_locale_arguments = --locale $(1) \
	--strings_file 'config/i18n/$(1)/*' \
	--strings_extra config/i18n/$(1)/

ifdef DEBUG
	ts_options = --sourceMap
	js_min = cat
	browserify_options += --debug
endif

setup:
	$(npm) install --unsafe-perm

run: clean build server

dirty-build: init build-css build-strings build-client build-server build-worker
build: clean dirty-build

test:
	./script/test

install:
	$(npm) install

server:
	node build/server/main

pm:
	./node_modules/.bin/pm2 start config/processes.yml --no-daemon

reset: clean
	-rm -fr node_modules typings

clean:
	-rm -r $(build_dir)
	mkdir $(build_dir)

init:
	-mkdir $(build_dir)

check:
	-./node_modules/.bin/snyk test

lint:
	$(ts_lint) --config config/tslint.json $(shell find src -name "*.ts")
	$(js_hint) --config config/jshint.json --reporter unix --show-non-errors \
		$(shell find src -name "*.js") \
		$(shell find test -name "*.js") \
		$(shell find config -name "*.js") \
		$(shell find config/migrations -name "*.js") \
		$(shell find assets -name "*.js") \
		$(shell find script -name "*.js")
	$(json_lint) --validate \
		$(shell find config -name "*.json")
	./script/lint-html-links
	./script/lint-yaml-file .travis.yml \
		$(shell find config -name "*.yml")

analize:
	-rm -r $(build_dir)/analize
	mkdir $(build_dir)/analize
	discify build/bundle.js > build/analize/disk.html

test-start-webdriver:
	if [ ! -d bin ]; then mkdir bin; fi
	if [ ! -d bin/node_modules/protractor ]; then \
		cd bin; \
		npm init -y; \
		npm install protractor@3.1.1; \
		node_modules/.bin/webdriver-manager update; \
	fi
	bin/node_modules/.bin/webdriver-manager start

test-e2e:
	./script/test e2e

test-integration:
	./script/test external
	./script/test integration

test-unit:
	./script/test unit

optimize:
	$(imageoptim) assets/images/*.png assets/images/*/*.png
	$(svgo) assets/images/

build-strings:
	./script/compile-string-files generate  --var $(i18n_varname) \
		$(call i18n_locale_arguments,en-US) --is_default | $(js_min) > $(build_dir)/i18n.en-US.js
	./script/compile-string-files generate  --var $(i18n_varname) \
		$(call i18n_locale_arguments,lolcat-US) | $(js_min) > $(build_dir)/i18n.lolcat-US.js

build-css:
ifdef DEBUG
	./node_modules/.bin/cssnext --sourcemap assets/styles/main.css $(build_css)
else
	./node_modules/.bin/cssnext assets/styles/main.css | \
		./node_modules/.bin/cssmin > $(build_css)
endif

build-ts: build-server build-worker build-client-app

build-server:
	$(tsc) src/typings.d.ts src/server/main.ts \
			src/record/models/* \
			src/auth/token.ts \
		--outDir $(build_dir) \
		--module commonjs \
		--pretty \
		--removeComments \
		--moduleResolution classic

build-worker:
	$(tsc) src/typings.d.ts src/worker/main.ts \
		--outDir $(build_dir) \
		--module commonjs \
		--pretty \
		--removeComments \
		--moduleResolution classic \
		--noImplicitAny

build-client: build-css build-client-deps build-client-app \
	build-client-bundle build-client-src

build-client-app:
	$(tsc) src/typings.d.ts src/client/main.ts --outDir $(build_dir) \
		--module commonjs \
		--rootDir ./ \
		$(ts_options)

build-client-bundle:
	$(browserify) $(build_dir)/src/client/main.js $(browserify_options) | \
		$(js_min) > $(build_bundle_js)

build-client-deps:
	@echo "" > $(build_vendor_js)
	@./script/compile-client-config $(global_config_varname) >> $(build_vendor_js)
	@for file in \
			node_modules/jquery/dist/jquery.js \
			node_modules/angular/angular.js \
			node_modules/angular-animate/angular-animate.js \
			node_modules/angular-aria/angular-aria.js \
			node_modules/angular-lazy-image/release/lazy-image.js \
			node_modules/angular-route/angular-route.js \
			node_modules/angular-sanitize/angular-sanitize.js \
			node_modules/dropzone/dist/dropzone.js \
			node_modules/q/q.js \
			node_modules/rollbar-browser/dist/rollbar.umd.nojson.js \
			node_modules/webcamjs/webcam.js \
	; do \
		$(js_sep) >> $(build_vendor_js); \
		$(js_min) $$file >> $(build_vendor_js); \
	done
	@echo "generated $(build_vendor_js)"

build-client-src:
	@echo "" > $(build_client_js)
	@for file in $(shell find src/ -name "*.js"); do \
		$(js_min) $$file >> $(build_client_js); \
	done
	@echo "generated $(build_client_js)"
