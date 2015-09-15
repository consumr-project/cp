.PHONY: build deploy install run

build_dir = build
build_app_js = $(build_dir)/app.js
build_vendor_js = $(build_dir)/vendor.js
build_css = $(build_dir)/site.css

npm = npm
tsd = ./node_modules/.bin/tsd
tsc = ./node_modules/.bin/tsc
browserify = ./node_modules/.bin/browserify
js_hint = ./node_modules/.bin/jshint
js_min = ./node_modules/.bin/jsmin
js_sep = @echo ";\n"

browserify_options =
ts_options =
css_options =
build_vars =

global_config_varname = TCP_BUILD_CONFIG

ifdef DEBUG
	browserify_options = --debug
	ts_options = --sourceMap
	css_options = --sourcemap
	build_vars = "DEBUG=*"
endif

run: clean build server

build: clean build-css build-js build-ts build-strings build-bundle

build-strings:
	./scripts/compile-string-files en i18n config/i18n/en/* config/i18n/en/ > $(build_dir)/en.js

build-css:
	./node_modules/.bin/cssnext app/elements/main.css $(build_css) \
		--compress $(css_options)

build-ts:
	./scripts/generate-client-config --typings $(global_config_varname) > typings/tcp.d.ts
	./scripts/compile-string-files --typings i18n > typings/i18n.d.ts
	$(tsc) app/modules/base/main.ts --outDir $(build_dir) --module commonjs $(ts_options) --rootDir ./

build-bundle:
	$(browserify) $(build_dir)/app/modules/base/main.js -o $(build_app_js) $(browserify_options)

build-js:
	echo "" > $(build_vendor_js)
	./scripts/generate-client-config --config $(global_config_varname) >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/rangy/lib/rangy-core.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/rangy/lib/rangy-classapplier.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/rangy/lib/rangy-highlighter.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/jquery/dist/jquery.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/lodash/index.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/angular/angular.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/angular-route/angular-route.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/angular-aria/angular-aria.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/firebase-bower/firebase.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/q/q.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/firebase-passport-login/client/firebase-passport-login.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)

install:
	$(npm) install
	$(tsd) install

deploy:
	git push heroku master

server:
	node server

reset: clean
	-rm -r node_modules typings

clean:
	-rm -r $(build_dir)

lint:
	$(js_hint) --config config/jshint.json --reporter unix --show-non-errors app
