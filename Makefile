.PHONY: install clean run service

build_dir = build

i18n_varname = i18n
i18n_locale_arguments = --locale $(1) --strings_file 'config/i18n/$(1)/*' --strings_extra config/i18n/$(1)/

rabbitmq_version = 3.5.6

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

rmq: rabbitmq
rabbit: rabbitmq
rabbitmq:
	if [ ! -d build ]; then mkdir build; fi
	if [ ! -f build/rabbitmq-$(rabbitmq_version).tar.gz ]; then \
		wget https://www.rabbitmq.com/releases/rabbitmq-server/v$(rabbitmq_version)/rabbitmq-server-mac-standalone-$(rabbitmq_version).tar.gz \
            -O build/rabbitmq-$(rabbitmq_version).tar.gz; fi
	if [ ! -d build/rabbitmq_server-$(rabbitmq_version) ]; then \
        tar -xf build/rabbitmq-$(rabbitmq_version).tar.gz -C build; fi
	echo "build/rabbitmq_server-$(rabbitmq_version)/sbin/rabbitmq-plugins enable rabbitmq_management"
	build/rabbitmq_server-$(rabbitmq_version)/sbin/rabbitmq-server
