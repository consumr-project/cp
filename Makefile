.PHONY: install clean migration seed

db_url = $(shell node -e "console.log(require('acm')('database.url'))")
sequelize = node_modules/.bin/sequelize
sequelize_params = --name TODO-UNNAMED-TODO --url $(db_url)

install:
	npm install

clean:
	-rm -r node_modules

migration:
	$(sequelize) migration:create $(sequelize_params)

seed:
	$(sequelize) seed:create $(sequelize_params)
