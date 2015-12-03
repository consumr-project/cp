.PHONY: install clean migration seed

sequelize = node_modules/.bin/sequelize
dburl = $(shell node -e "console.log(require('acm')('database.url'))")

install:
	npm install

clean:
	-rm -r node_modules

migration:
	$(sequelize) migration:create --name update --url $(dburl)

seed:
	$(sequelize) seed:create --name data --url $(dburl)
