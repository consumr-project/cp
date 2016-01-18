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
for additional configuration options (linkedin, embedly, monitoring, etc.):

- [auth-service](https://github.com/consumr-project/auth-service)
- [extract-service](https://github.com/consumr-project/extract-service)
- [search-service](https://github.com/consumr-project/search-service)
- [query-service](https://github.com/consumr-project/query-service)

to build and run application in debug mode:

```bash
export NPM_CONFIG_PRODUCTION=false
export DEBUG=*
```

### services

#### new relic

For heroku, follow
[new relic's installation instructions](https://elements.heroku.com/addons/newrelic#wayne)
and [configuration instructions](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration#environment-variable-overrides)
as well:

```bash
export NEW_RELIC_LICENSE_KEY='...'
export NEW_RELIC_APP_NAME='cp-local-'$(whoami)
export NEW_RELIC_LOG_LEVEL='info'
```

### logging

#### rollbar

rollbar is used for client-side loggin. only a token and environment identifier
are required as configuration. the `NODE_ENV` variable is checked for the
environment, with 'development' as the default.

```bash
export ROLLBAR_TOKEN='...'
export NODE_ENV='development'
```

### thanks

* Edward Boatman for the [face](https://thenounproject.com/search/?q=face&i=67226) icon
* Austin Condiff for the [menu](https://thenounproject.com/search/?q=hamburger&i=70916) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
* Brent Jackson for the [loading](http://jxnblk.com/loading/) svg
