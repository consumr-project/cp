mongodb_os = osx
mongodb_architecture = x86_64
mongodb_version = 3.2.1
rabbitmq_version = 3.5.6

# build-strings:
# 	-mkdir build
# 	echo "var $(i18n_varname) = {};" > $(build_dir)/i18n.js
# 	./scripts/compile-string-files functions --var $(i18n_varname) --locale en >> $(build_dir)/i18n.js
# 	./scripts/compile-string-files functions --var $(i18n_varname).en --locale en >> $(build_dir)/i18n.js
# 	./scripts/compile-string-files generate  --var $(i18n_varname).en $(call i18n_locale_arguments,en) >> $(build_dir)/i18n.js
# 	echo "module.exports = $(i18n_varname);" >> $(build_dir)/i18n.js

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
