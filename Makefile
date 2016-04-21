.PHONY: build install run test clean

services = auth extract notification query search user
pwd = $(shell pwd)

build_dir = build
build_bundle_js = $(build_dir)/bundle.js
build_client_js = $(build_dir)/client.js
build_vendor_js = $(build_dir)/vendor.js
build_css = $(build_dir)/site.css

npm = npm
typings = ./node_modules/.bin/typings
tape = ./node_modules/.bin/tape
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
i18n_locale_arguments = --locale $(1) --strings_file 'config/i18n/$(1)/*' \
	--strings_extra config/i18n/$(1)/

ifdef DEBUG
	ts_options = --sourceMap
	build_vars = "DEBUG=*"
	js_min = cat
endif

all: build

include src/service/notification/Makefile.mk
include src/service/query/Makefile.mk
include src/service/search/Makefile.mk

run: clean build server

test: test-unit test-integration test-e2e

build: clean build-css build-strings build-client build-server

install:
	$(npm) install

server:
	node build/server/main

reset: clean
	-rm -fr node_modules typings

clean:
	-rm -r $(build_dir)
	mkdir $(build_dir)

lint:
	./scripts/static-analyzis
	$(js_hint) --config config/jshint.json --reporter unix --show-non-errors \
		src scripts test

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
	$(protractor) config/protractor.js

test-integration:
	$(tape) `find test/integration -name "*.js"`

test-unit:
	$(tape) `find test/src -name "*.js"`

optimize:
	$(imageoptim) assets/images/*.png assets/images/*/*.png
	$(svgo) assets/images/

build-strings:
	./scripts/compile-string-files generate  --var $(i18n_varname) \
		$(call i18n_locale_arguments,en) > $(build_dir)/i18n.en.js
	./scripts/compile-string-files generate  --var $(i18n_varname) \
		$(call i18n_locale_arguments,lolcat) > $(build_dir)/i18n.lolcat.js

build-css:
ifdef DEBUG
	./node_modules/.bin/cssnext --sourcemap assets/styles/main.css $(build_css)
else
	./node_modules/.bin/cssnext assets/styles/main.css | \
		./node_modules/.bin/cssmin > $(build_css)
endif

build-server:
	$(tsc) src/typings.d.ts src/server/main.ts src/service/query/models/* \
		--outDir $(build_dir) --module commonjs --pretty --removeComments \
		--moduleResolution classic

build-client: build-css build-client-deps build-client-app \
	build-client-bundle build-client-src

build-client-app:
	$(tsc) src/typings.d.ts src/client/main.ts --outDir $(build_dir) \
		--module commonjs $(ts_options) --rootDir ./

build-client-bundle:
ifdef DEBUG
	$(browserify) $(build_dir)/src/client/main.js --debug > $(build_bundle_js)
else
	$(browserify) $(build_dir)/src/client/main.js | \
		./node_modules/.bin/uglifyjs > $(build_bundle_js)
endif

build-client-deps:
	echo "" > $(build_vendor_js)
	./scripts/compile-client-config $(global_config_varname) >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/jquery/dist/jquery.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular/angular.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-route/angular-route.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-aria/angular-aria.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-animate/angular-animate.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-lazy-image/release/lazy-image.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/q/q.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/rollbar-browser/dist/rollbar.umd.nojson.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/datedropper/datedropper.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)

build-client-src:
	echo "" > $(build_client_js)
	$(js_min) src/client/initializers/rollbar-config.js >> $(build_client_js)
	$(js_min) src/client/initializers/scroll-offset-class.js >> $(build_client_js)
	$(js_min) src/client/elements/anchored.js >> $(build_client_js)
	$(js_min) src/client/elements/collapsable.js >> $(build_client_js)
	$(js_min) src/client/elements/pills.js >> $(build_client_js)
	$(js_min) src/client/elements/chart.js >> $(build_client_js)
	$(js_min) src/client/elements/options.js >> $(build_client_js)
	$(js_min) src/client/elements/options-item.js >> $(build_client_js)
	$(js_min) src/client/elements/popover.js >> $(build_client_js)
	$(js_min) src/client/elements/popover-item.js >> $(build_client_js)
	$(js_min) src/client/elements/avatar.js >> $(build_client_js)
	$(js_min) src/client/elements/message.js >> $(build_client_js)
	$(js_min) src/client/elements/indicator.js >> $(build_client_js)
	$(js_min) src/client/elements/key.js >> $(build_client_js)
	$(js_min) src/client/elements/tag.js >> $(build_client_js)
	$(js_min) src/client/elements/tags.js >> $(build_client_js)
	$(js_min) src/client/elements/i18n.js >> $(build_client_js)
	$(js_min) src/client/components/user.js >> $(build_client_js)
	$(js_min) src/client/components/search.js >> $(build_client_js)
	$(js_min) src/client/components/notifications.js >> $(build_client_js)
	$(js_min) src/client/components/topmost.js >> $(build_client_js)
	$(js_min) src/client/components/state.js >> $(build_client_js)
	$(js_min) src/client/components/company.js >> $(build_client_js)
	$(js_min) src/client/components/event.js >> $(build_client_js)
	$(js_min) src/client/components/events.js >> $(build_client_js)
	$(js_min) src/client/components/review.js >> $(build_client_js)
	$(js_min) src/client/components/reviews.js >> $(build_client_js)
	$(js_min) src/client/services/Navigation.js >> $(build_client_js)
	$(js_min) src/client/services/Feature.js >> $(build_client_js)
	$(js_min) src/client/services/Services.js >> $(build_client_js)
	$(js_min) src/client/services/Session.js >> $(build_client_js)
	$(js_min) src/client/vendor/angular/ngFocus.js >> $(build_client_js)
	$(js_min) src/client/vendor/angular/ngInvisible.js >> $(build_client_js)
	$(js_min) src/client/vendor/angular/ngDatePicker.js >> $(build_client_js)
