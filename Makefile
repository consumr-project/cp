.PHONY: install clean migration seed build

services = auth

db_url = $(shell node -e "console.log(require('acm')('database.url'))")
sequelize = node_modules/.bin/sequelize

typings = ./node_modules/.bin/typings
tsc = ./node_modules/.bin/tsc
tape = ./node_modules/.bin/tape

dir_source = src
dir_build = build

build:
	$(tsc) config/typings.d.ts $(dir_source)/* $(dir_source)/models/*  --outDir $(dir_build) \
		--module commonjs --removeComments --moduleResolution classic \
		--allowJs

install:
	npm install
	$(typings) install

clean:
	-rm -r node_modules typings

postgres: postgresql
postgresql:
	postgres

migration:
	@$(sequelize) migration:create --url $(db_url) --migrations-path db/migrations \
		--name NEWFILE

seed:
	@$(sequelize) seed:create --url $(db_url) --seeders-path db/seeders \
		--name NEWFILE

sync: database-update

database-update:
	@$(sequelize) db:migrate --url $(db_url) --migrations-path db/migrations
	@$(sequelize) db:seed --url $(db_url) --seeders-path db/seeders

database-revert-migration:
	@$(sequelize) db:migrate:undo --url $(db_url) --seeders-path db/migrations

database-revert-seed:
	@$(sequelize) db:seed:undo --url $(db_url) --seeders-path db/seeders

local:
	-$(foreach service,$(services),rm -r node_modules/$(service)-service;)
	-$(foreach service,$(services),npm link ../$(service)-service;)

test: test/*/*
	$(tape) test/*/*.js

test-integration: test/integration/*
	$(tape) test/integration/*
