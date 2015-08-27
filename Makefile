.PHONY: build deploy install run

built_dir = static
built_vendor_js = $(built_dir)/vendor.js
built_css = $(built_dir)/site.css

js_hint = ./node_modules/.bin/jshint
js_min = ./node_modules/.bin/jsmin
js_sep = @echo ";\n"

css_options =
build_vars =

ifdef DEBUG
	css_options = --sourcemap
	build_vars = "DEBUG=*"
endif

build-css:
	./node_modules/.bin/cssnext app/elements/main.css $(built_css) \
		--compress $(css_options)

build-js:
	echo "" > $(built_vendor_js)
	./scripts/generate-client-config TCP_BUILD_CONFIG >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	cat node_modules/reqwest/reqwest.min.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/rangy/lib/rangy-core.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/rangy/lib/rangy-classapplier.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/rangy/lib/rangy-highlighter.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/jquery/dist/jquery.min.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/lodash/index.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	cat node_modules/angular/angular.min.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	cat node_modules/angular-route/angular-route.min.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	cat node_modules/angular-aria/angular-aria.min.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	cat node_modules/firebase-bower/firebase.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/q/q.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)
	$(js_min) node_modules/firebase-passport-login/client/firebase-passport-login.js >> $(built_vendor_js)
	$(js_sep) >> $(built_vendor_js)

build-strings:
	./scripts/compile-string-files en config/i18n/en/* config/i18n/en/ > $(built_dir)/en.js

install:
	npm install

deploy:
	git push heroku master

run: build
	node server

reset: clean
	-rm -r node_modules

clean:
	-rm -r $(built_dir)

watcher:
	fswatch -r app | xargs -n1 sh -c "$(build_vars) make build-css"

lint:
	$(js_hint) --config config/jshint.json --reporter unix --show-non-errors app

build: clean build-css build-js build-strings
