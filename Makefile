.PHONY: install clean migration seed

db_url = $(shell node -e "console.log(require('acm')('database.url'))")
sequelize = node_modules/.bin/sequelize

install:
	npm install

clean:
	-rm -r node_modules

migration:
	@$(sequelize) migration:create --url $(db_url) --migrations-path db/migrations \
		--name NEWFILE

seed:
	@$(sequelize) seed:create --url $(db_url) --seeders-path db/seeders \
		--name NEWFILE

database-update:
	@$(sequelize) db:migrate --url $(db_url) --migrations-path db/migrations
	@$(sequelize) db:seed --url $(db_url) --seeders-path db/seeders

database-revert-migration:
	@$(sequelize) db:migrate:undo --url $(db_url) --seeders-path db/migrations

database-revert-seed:
	@$(sequelize) db:seed:undo --url $(db_url) --seeders-path db/seeders
