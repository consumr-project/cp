.PHONY: install clean migration seed

db_url = $(shell node -e "console.log(require('acm')('database.url'))")
sequelize = node_modules/.bin/sequelize

install:
	npm install

clean:
	-rm -r node_modules

seed:
	@$(sequelize) seed:create --url $(db_url) --name NEWFILE \
		--seeders-path db/seeders
