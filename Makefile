.PHONY: build deploy install run

built_dir = static
built_vendor_js = $(built_dir)/vendor.js
built_css = $(built_dir)/site.css

js_min = ./node_modules/.bin/jsmin
js_sep = @echo ";\n"

ifdef DEBUG
	css_options = $(shell test -z "$DEBUG" || echo "--sourcemap")
else
	css_options =
endif

build-css:
	./node_modules/.bin/cssnext app/elements/main.css $(built_css) \
		--compress $(css_options)

build-js:
	echo "" > $(built_vendor_js)
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

install:
	npm install

deploy:
	git push heroku master

run: build
	node server

clean:
	-rm -r static

build: clean build-css build-js
