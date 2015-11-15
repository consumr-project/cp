.PHONY: install clean run service

run: install service

clean:
	-rm -r node_modules

install:
	npm install

service:
	node service
