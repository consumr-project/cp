.PHONY: build install run test local

services = auth extract notification query search user
pwd = $(shell pwd)

build_dir = build
build_bundle_js = $(build_dir)/bundle.js
build_app_js = $(build_dir)/app.js
build_vendor_js = $(build_dir)/vendor.js
build_css = $(build_dir)/site.css
test_dir = test

npm = npm
tsc = ./node_modules/.bin/tsc
imageoptim = imageoptim
svgo = svgo
browserify = ./node_modules/.bin/browserify
protractor = ./node_modules/.bin/protractor
js_hint = ./node_modules/.bin/jshint
js_min = ./node_modules/.bin/uglifyjs
js_sep = @echo ";\n"

ts_options =
build_vars =

global_config_varname = TCP_BUILD_CONFIG
i18n_varname = i18n
i18n_locale_arguments = --locale $(1) --strings_file 'config/i18n/$(1)/*' --strings_extra config/i18n/$(1)/

ifdef DEBUG
	ts_options = --sourceMap
	build_vars = "DEBUG=*"
	js_min = cat
endif

run: clean build server

webdriver:
	if [ ! -d node_modules/protractor ]; then \
		npm install protractor@3.1.1; \
		node_modules/.bin/webdriver-manager update; \
	fi
	node_modules/.bin/webdriver-manager start

test:
	$(protractor) config/protractor.js

optimize:
	$(imageoptim) assets/images/*.png assets/images/*/*.png
	$(svgo) assets/images/

build: clean build-css build-js build-ts build-strings build-bundle build-app

build-strings:
	./scripts/compile-string-files functions --var $(i18n_varname) --locale en > $(build_dir)/i18n.js
	./scripts/compile-string-files generate  --var $(i18n_varname) $(call i18n_locale_arguments,en) > $(build_dir)/i18n.en.js
	./scripts/compile-string-files generate  --var $(i18n_varname) $(call i18n_locale_arguments,lolcat) > $(build_dir)/i18n.lolcat.js

build-css:
ifdef DEBUG
	./node_modules/.bin/cssnext --sourcemap assets/styles/main.css $(build_css)
else
	./node_modules/.bin/cssnext assets/styles/main.css | \
		./node_modules/.bin/cssmin > $(build_css)
endif

build-ts:
	-$(tsc) app/main.ts --outDir $(build_dir) --module commonjs $(ts_options) --rootDir ./

build-bundle:
ifdef DEBUG
	$(browserify) $(build_dir)/app//main.js --debug > $(build_bundle_js)
else
	$(browserify) $(build_dir)/app//main.js | \
		./node_modules/.bin/uglifyjs > $(build_bundle_js)
endif

build-js:
	echo "" > $(build_vendor_js)
	./scripts/generate-client-config $(global_config_varname) >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/jquery/dist/jquery.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular/angular.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-route/angular-route.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-aria/angular-aria.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-animate/angular-animate.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/q/q.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/rollbar-browser/dist/rollbar.umd.nojson.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	cat node_modules/datedropper/datedropper.min.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)

build-app:
	echo "" > $(build_app_js)
	$(js_min) assets/scripts/rollbar-config.js >> $(build_app_js)
	$(js_min) assets/scripts/scroll-offset-class.js >> $(build_app_js)
	$(js_min) app/elements/anchored.js >> $(build_app_js)
	$(js_min) app/elements/collapsable.js >> $(build_app_js)
	$(js_min) app/elements/pills.js >> $(build_app_js)
	$(js_min) app/elements/chart.js >> $(build_app_js)
	$(js_min) app/elements/popover.js >> $(build_app_js)
	$(js_min) app/elements/popover-item.js >> $(build_app_js)
	$(js_min) app/elements/avatar.js >> $(build_app_js)
	$(js_min) app/elements/message.js >> $(build_app_js)
	$(js_min) app/elements/indicator.js >> $(build_app_js)
	$(js_min) app/elements/key.js >> $(build_app_js)
	$(js_min) app/elements/tag.js >> $(build_app_js)
	$(js_min) app/elements/tags.js >> $(build_app_js)
	$(js_min) app/elements/i18n.js >> $(build_app_js)
	$(js_min) app/components/user.js >> $(build_app_js)
	$(js_min) app/components/search.js >> $(build_app_js)
	$(js_min) app/components/notifications.js >> $(build_app_js)
	$(js_min) app/components/topmost.js >> $(build_app_js)
	$(js_min) app/components/state.js >> $(build_app_js)
	$(js_min) app/components/company.js >> $(build_app_js)
	$(js_min) app/components/event.js >> $(build_app_js)
	$(js_min) app/components/events.js >> $(build_app_js)
	$(js_min) app/components/reviews.js >> $(build_app_js)
	$(js_min) app/services/Navigation.js >> $(build_app_js)
	$(js_min) app/services/Feature.js >> $(build_app_js)
	$(js_min) app/services/Services.js >> $(build_app_js)
	$(js_min) app/services/Session.js >> $(build_app_js)
	$(js_min) app/vendor/angular/ngFocus.js >> $(build_app_js)
	$(js_min) app/vendor/angular/ngInvisible.js >> $(build_app_js)
	$(js_min) app/vendor/angular/ngDatePicker.js >> $(build_app_js)

install:
	$(npm) install

deploy-heroku:
	git push heroku master

server:
	node app/server

reset: clean
	-rm -fr node_modules

clean:
	-rm -r $(build_dir)
	mkdir $(build_dir)

lint:
	./scripts/static-analyzis
	$(js_hint) --config config/jshint.json --reporter unix --show-non-errors app assets scripts test

local:
	-$(foreach service,$(services),rm -r node_modules/$(service)-service;)
	-$(foreach service,$(services),npm link ../$(service)-service;)

stamp:
	echo "{ \
		\"date\": \"$(shell date)\", \
		\"head\": \"$(shell git log -1 --format="%H")\", \
		\"branch\": \"$(shell git rev-parse --abbrev-ref HEAD)\" \
	}" > stamp.json
