.PHONY: build install run test

build_dir = build
build_bundle_js = $(build_dir)/bundle.js
build_app_js = $(build_dir)/app.js
build_vendor_js = $(build_dir)/vendor.js
build_css = $(build_dir)/site.css
typings_dir = typings
test_dir = test

npm = npm
tsd = ./node_modules/.bin/tsd
tsc = ./node_modules/.bin/tsc
imageoptim = ./node_modules/.bin/imageoptim
svgo = ./node_modules/.bin/svgo
browserify = ./node_modules/.bin/browserify
mocha = ./node_modules/.bin/mocha
js_hint = ./node_modules/.bin/jshint
js_min = ./node_modules/.bin/jsmin
js_sep = @echo ";\n"

browserify_options =
ts_options =
css_options =
build_vars =

global_config_varname = TCP_BUILD_CONFIG
i18n_varname = i18n
i18n_locale_arguments = --locale $(1) --strings_file 'config/i18n/$(1)/*' --strings_extra config/i18n/$(1)/

ifdef DEBUG
	browserify_options = --debug
	ts_options = --sourceMap
	css_options = --sourcemap
	build_vars = "DEBUG=*"
	js_min = cat
endif

run: clean build server

test:
	$(mocha) test/**/*.js

optimize:
	$(imageoptim) assets/images/*.png
	$(svgo) -i assets/images
	$(svgo) -i app/elements/indicator/images

build: clean build-css build-js build-ts build-strings build-bundle build-app

build-strings:
	./scripts/compile-string-files functions --var $(i18n_varname) --locale en > $(build_dir)/i18n.js
	./scripts/compile-string-files generate  --var $(i18n_varname) $(call i18n_locale_arguments,en) > $(build_dir)/en.js

build-css:
	./node_modules/.bin/cssnext app/elements/base/main.css $(build_css) \
		--compress $(css_options)

build-ts:
	$(tsc) app/modules/base/main.ts --outDir $(build_dir) --module commonjs $(ts_options) --rootDir ./

build-bundle:
	$(browserify) $(build_dir)/app/modules/base/main.js -o $(build_bundle_js) $(browserify_options)

build-js:
	echo "" > $(build_vendor_js)
	./scripts/generate-client-config $(global_config_varname) >> $(build_vendor_js)
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
	$(js_min) node_modules/q/q.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/rollbar-browser/dist/rollbar.umd.nojson.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)

build-app:
	echo "" > $(build_app_js)
	$(js_min) app/elements/anchored/anchored.js >> $(build_app_js)
	$(js_min) app/elements/pills/pills.js >> $(build_app_js)
	$(js_min) app/elements/popover/popover.js >> $(build_app_js)
	$(js_min) app/elements/popover/popover-item.js >> $(build_app_js)
	$(js_min) app/elements/avatar/avatar.js >> $(build_app_js)
	$(js_min) app/elements/message/message.js >> $(build_app_js)
	$(js_min) app/elements/indicator/indicator.js >> $(build_app_js)
	$(js_min) app/elements/key/key.js >> $(build_app_js)
	$(js_min) app/elements/tag/tag.js >> $(build_app_js)
	$(js_min) app/elements/tag/tags.js >> $(build_app_js)
	$(js_min) app/elements/i18n/i18n.js >> $(build_app_js)
	$(js_min) app/elements/followed-by/followed-by.js >> $(build_app_js)
	$(js_min) app/components/user/user.js >> $(build_app_js)
	$(js_min) app/components/company/company.js >> $(build_app_js)
	$(js_min) app/components/company-event/company-event.js >> $(build_app_js)
	$(js_min) app/modules/base/AdminController.js >> $(build_app_js)
	$(js_min) app/modules/base/NavigationController.js >> $(build_app_js)
	$(js_min) app/services/NavigationService.js >> $(build_app_js)
	$(js_min) app/services/ServicesService.js >> $(build_app_js)
	$(js_min) app/services/SessionService.js >> $(build_app_js)
	$(js_min) app/modules/search/SearchController.js >> $(build_app_js)
	$(js_min) app/vendor/angular/ngFocus.js >> $(build_app_js)

install:
	$(npm) install
	$(tsd) install

deploy-heroku:
	git push heroku master

server:
	node server

reset: clean
	-rm -fr node_modules $(typings_dir)

clean:
	-rm -r $(build_dir)

lint:
	$(js_hint) --config config/jshint.json --reporter unix --show-non-errors app
