.PHONY: build install run test clean

pwd = $(shell pwd)

build_dir = build
build_bundle_js = $(build_dir)/bundle.js
build_client_js = $(build_dir)/client.js
build_vendor_js = $(build_dir)/vendor.js
build_css = $(build_dir)/site.css

npm = npm
typings = ./node_modules/.bin/typings
tsc = ./node_modules/.bin/tsc
ts_lint = ./node_modules/.bin/tslint
json_lint = ./node_modules/.bin/jsonlint-cli
imageoptim = imageoptim
svgo = svgo
browserify = ./node_modules/.bin/browserify
js_hint = ./node_modules/.bin/jshint
js_min = ./node_modules/.bin/uglifyjs
js_sep = @echo ";\n"

ts_options =
build_vars =

global_config_varname = TCP_BUILD_CONFIG
i18n_varname = i18n
i18n_locale_arguments = --locale $(1) --strings_file 'config/i18n/$(1)/*' \
	--strings_extra config/i18n/$(1)/

mongodb_os = osx
mongodb_architecture = x86_64
mongodb_version = 3.2.1
rabbitmq_version = 3.5.6
es_version = 1.7.3

ifdef DEBUG
	ts_options = --sourceMap
	build_vars = "DEBUG=*"
	js_min = cat
endif

all: build

run: clean build server

build: clean build-css build-strings build-client build-server build-worker

test:
	./script/test

install:
	$(npm) install

server:
	node build/server/main

reset: clean
	-rm -fr node_modules typings

clean:
	-rm -r $(build_dir)
	mkdir $(build_dir)

check:
	-./node_modules/.bin/snyk test

lint:
	./script/lint-html-links
	./script/lint-yaml-file .travis.yml \
		$(shell find config -name "*.yml")
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
		$(call i18n_locale_arguments,en) --is_default | $(js_min) > $(build_dir)/i18n.en.js
	./script/compile-string-files generate  --var $(i18n_varname) \
		$(call i18n_locale_arguments,lolcat) | $(js_min) > $(build_dir)/i18n.lolcat.js

build-css:
ifdef DEBUG
	./node_modules/.bin/cssnext --sourcemap assets/styles/main.css $(build_css)
else
	./node_modules/.bin/cssnext assets/styles/main.css | \
		./node_modules/.bin/cssmin > $(build_css)
endif

build-server:
	$(tsc) src/typings.d.ts src/server/main.ts src/record/models/* \
		--outDir $(build_dir) --module commonjs --pretty --removeComments \
		--moduleResolution classic

build-worker:
	$(tsc) src/typings.d.ts src/worker/main.ts \
		--outDir $(build_dir) --module commonjs --pretty --removeComments \
		--moduleResolution classic --noImplicitAny

build-client: build-css build-client-deps build-client-app \
	build-client-bundle build-client-src

build-client-app:
	$(tsc) src/typings.d.ts src/client/main.ts --outDir $(build_dir) \
		--module commonjs $(ts_options) --rootDir ./

build-client-bundle:
ifdef DEBUG
	$(browserify) $(build_dir)/src/client/main.js --external aws4 --debug > $(build_bundle_js)
else
	$(browserify) $(build_dir)/src/client/main.js --external aws4 | \
		./node_modules/.bin/uglifyjs > $(build_bundle_js)
endif

build-client-deps:
	echo "" > $(build_vendor_js)
	./script/compile-client-config $(global_config_varname) >> $(build_vendor_js)
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
	$(js_min) node_modules/angular-sanitize/angular-sanitize.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/angular-lazy-image/release/lazy-image.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/q/q.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)
	$(js_min) node_modules/rollbar-browser/dist/rollbar.umd.nojson.js >> $(build_vendor_js)
	$(js_sep) >> $(build_vendor_js)

build-client-src:
	echo "" > $(build_client_js)
	$(js_min) src/client/initializers/keyboard-shortcuts.js >> $(build_client_js)
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
	$(js_min) src/client/elements/snav.js >> $(build_client_js)
	$(js_min) src/client/elements/snav-item.js >> $(build_client_js)
	$(js_min) src/client/elements/message.js >> $(build_client_js)
	$(js_min) src/client/elements/indicator.js >> $(build_client_js)
	$(js_min) src/client/elements/tag.js >> $(build_client_js)
	$(js_min) src/client/elements/tags.js >> $(build_client_js)
	$(js_min) src/client/elements/i18n.js >> $(build_client_js)
	$(js_min) src/client/elements/datepicker.js >> $(build_client_js)
	$(js_min) src/client/components/user.js >> $(build_client_js)
	$(js_min) src/client/components/search.js >> $(build_client_js)
	$(js_min) src/client/components/notification.js >> $(build_client_js)
	$(js_min) src/client/components/notifications.js >> $(build_client_js)
	$(js_min) src/client/components/topmost.js >> $(build_client_js)
	$(js_min) src/client/components/state.js >> $(build_client_js)
	$(js_min) src/client/components/trending.js >> $(build_client_js)
	$(js_min) src/client/components/company.js >> $(build_client_js)
	$(js_min) src/client/components/home-view.js >> $(build_client_js)
	$(js_min) src/client/components/tag-view.js >> $(build_client_js)
	$(js_min) src/client/components/feedback.js >> $(build_client_js)
	$(js_min) src/client/components/event.js >> $(build_client_js)
	$(js_min) src/client/components/source.js >> $(build_client_js)
	$(js_min) src/client/components/timeline.js >> $(build_client_js)
	$(js_min) src/client/components/question.js >> $(build_client_js)
	$(js_min) src/client/components/review.js >> $(build_client_js)
	$(js_min) src/client/components/reviews.js >> $(build_client_js)
	$(js_min) src/client/services/Navigation.js >> $(build_client_js)
	$(js_min) src/client/services/Feature.js >> $(build_client_js)
	$(js_min) src/client/services/Services.js >> $(build_client_js)
	$(js_min) src/client/services/Session.js >> $(build_client_js)
	$(js_min) src/client/vendor/angular/ngFocus.js >> $(build_client_js)
	$(js_min) src/client/vendor/angular/ngInvisible.js >> $(build_client_js)

postgres: postgresql
postgresql:
	postgres

es: elasticsearch
elasticsearch:
	-if [ ! -d bin ]; then mkdir bin; fi
	if [ ! -f bin/elasticsearch-$(es_version).zip ]; then \
        wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$(es_version).zip \
            -O bin/elasticsearch-$(es_version).zip; fi
	if [ ! -d bin/elasticsearch-$(es_version) ]; then \
        unzip bin/elasticsearch-$(es_version).zip -d bin/elasticsearch-$(es_version); fi
	bin/elasticsearch-$(es_version)/elasticsearch-$(es_version)/bin/elasticsearch

rmq: rabbitmq
rabbit: rabbitmq
rabbitmq:
	-if [ ! -d bin ]; then mkdir bin; fi
	if [ ! -f bin/rabbitmq-$(rabbitmq_version).tar.gz ]; then \
		wget https://www.rabbitmq.com/releases/rabbitmq-server/v$(rabbitmq_version)/rabbitmq-server-mac-standalone-$(rabbitmq_version).tar.gz \
            -O bin/rabbitmq-$(rabbitmq_version).tar.gz; fi
	if [ ! -d bin/rabbitmq_server-$(rabbitmq_version) ]; then \
        tar -xf bin/rabbitmq-$(rabbitmq_version).tar.gz -C bin; fi
	echo "bin/rabbitmq_server-$(rabbitmq_version)/sbin/rabbitmq-plugins enable rabbitmq_management"
	echo "http://localhost:15672/"
	bin/rabbitmq_server-$(rabbitmq_version)/sbin/rabbitmq-server

mongo: mongodb
mongodb:
	-if [ ! -d bin ]; then mkdir bin; fi
	if [ ! -f bin/mongodb-$(mongodb_version).tar.gz ]; then \
		wget https://fastdl.mongodb.org/$(mongodb_os)/mongodb-$(mongodb_os)-$(mongodb_architecture)-$(mongodb_version).tgz \
            -O bin/mongodb-$(mongodb_version).tar.gz; fi
	if [ ! -d bin/mongodb-$(mongodb_os)-$(mongodb_architecture)-$(mongodb_version) ]; then \
        tar -xf bin/mongodb-$(mongodb_version).tar.gz -C bin; fi
	echo "bin/mongodb-$(mongodb_os)-$(mongodb_architecture)-$(mongodb_version)/bin/mongod"
	bin/mongodb-$(mongodb_os)-$(mongodb_architecture)-$(mongodb_version)/bin/mongod
