.PHONY: install clean run service

build_dir = build

i18n_varname = i18n
i18n_locale_arguments = --locale $(1) --strings_file 'config/i18n/$(1)/*' --strings_extra config/i18n/$(1)/

run: install build service

clean:
	-rm -r build
	-rm -r node_modules

install:
	npm install

service:
	node service

build: build-strings

build-strings:
	-mkdir build
	echo "var $(i18n_varname) = {};" > $(build_dir)/i18n.js
	./scripts/compile-string-files functions --var $(i18n_varname) --locale en >> $(build_dir)/i18n.js
	./scripts/compile-string-files functions --var $(i18n_varname).en --locale en >> $(build_dir)/i18n.js
	./scripts/compile-string-files generate  --var $(i18n_varname).en $(call i18n_locale_arguments,en) >> $(build_dir)/i18n.js
	echo "module.exports = $(i18n_varname);" >> $(build_dir)/i18n.js
