![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/consumr-project/web-client.svg)](https://travis-ci.org/consumr-project/web-client)

### usage

`make build server` will install depedencies, compile source, and start a web
server.

### configuration

configuration is retrieved using [acm](https://www.npmjs.com/package/acm).
expected configuration variables. `DEBUG` to run (server and client logs) and
build (source maps) in debug mode. `PORT` to run web server in a port other
than `3000`. see `config/` and `docs/` directories and the following services
for additional configuration options (linkedin, firebase, embedly, monitoring,
etc.):

- [auth-service](https://github.com/consumr-project/auth-service/blob/master/README.md#deploying-to-heroku)
- [extract-service](https://github.com/consumr-project/extract-service/blob/master/README.md#deploying-to-heroku)
- [search-service](https://github.com/consumr-project/search-service/blob/master/README.md#deploying-to-heroku)
- [query-service](https://github.com/consumr-project/query-service/blob/master/README.md#deploying-to-heroku)

### deploying to heroku

first, update required configuration items and push them to heroku. finally,
deploy to heroku by running `make deploy-heroku` or `git push heroku origin`

to build and run application in debug mode:

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set DEBUG=*
```

### thanks

* Edward Boatman for the [face](https://thenounproject.com/search/?q=face&i=67226) icon
* Austin Condiff for the [menu](https://thenounproject.com/search/?q=hamburger&i=70916) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
* Brent Jackson for the [loading](http://jxnblk.com/loading/) svg
