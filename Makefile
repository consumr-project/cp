.PHONY: install clean migration seed

db_url = $(shell node -e "console.log(require('acm')('database.url'))")
sequelize = node_modules/.bin/sequelize

install:
	npm install

clean:
	-rm -r node_modules

seed:
	@$(sequelize) seed:create --url $(db_url) --seeders-path db/seeders \
		--name NEWFILE

database-update:
	@$(sequelize) db:seed --url $(db_url) --seeders-path db/seeders

database-revert:
	@$(sequelize) db:seed:undo --url $(db_url) --seeders-path db/seeders
