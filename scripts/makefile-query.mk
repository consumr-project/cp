db_url = $(shell node -e "console.log(require('acm')('database.url'))")
sequelize = node_modules/.bin/sequelize

postgres: postgresql
postgresql:
	postgres

migration:
	@$(sequelize) migration:create --url $(db_url) --migrations-path db/migrations \
		--name NEWFILE

seed:
	@$(sequelize) seed:create --url $(db_url) --seeders-path db/seeders \
		--name NEWFILE

database-update: database-sync database-migrate

database-sync:
	@$(sequelize) db:seed --url $(db_url) --seeders-path db/seeders

database-migrate:
	@$(sequelize) db:migrate --url $(db_url) --migrations-path db/migrations

database-revert-migration:
	@$(sequelize) db:migrate:undo --url $(db_url) --seeders-path db/migrations

database-revert-seed:
	@$(sequelize) db:seed:undo --url $(db_url) --seeders-path db/seeders
