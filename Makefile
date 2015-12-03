.PHONY: install clean dburl

install:
	npm install

clean:
	-rm -r node_modules

dburl:
	@node -e "console.log(require('acm')('database.url'))"
