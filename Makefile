clean:
	-rm -r node_modules
	
install:
	npm install

service:
	node service

run: install service
