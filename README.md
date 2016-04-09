![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/consumr-project/web-client.svg)](https://travis-ci.org/consumr-project/web-client)

### usage

`make build server` will install depedencies, compile source, and start a web
server.

### configuration

configuration is retrieved using [acm](https://www.npmjs.com/package/acm).
expected configuration variables. declare `DEBUG` to run (server and client
logs) and build (source maps) in debug mode. declare `PORT` to run web server
in a port other than `3000`. see `config/` directory for additional
configuration options (linkedin, embedly, monitoring, etc.):

to build and run application in debug mode:

```bash
export NPM_CONFIG_PRODUCTION=false
export DEBUG=*
```

```bash
export EMBEDLY_API_KEY=$(echo $CP_EMBEDLY_API_KEY)
export CRUNCHBASE_API_KEY=$(echo $CP_CRUNCHBASE_API_KEY)
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
* To Uyen for the [book](https://thenounproject.com/search/?q=book&i=249760) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
* artworkbean for the [star](https://thenounproject.com/search/?q=star&i=101463) icon
* Rafaël Massé for the [link](https://thenounproject.com/search/?q=link&i=49479) icon
* Herbert Spencer for the [hammer](https://thenounproject.com/search/?q=hammer&i=333481) icon
* Arthur Shlain for the [world](https://thenounproject.com/search/?q=world&i=292103) icon
* Sascha Elmers for the [sheep](https://thenounproject.com/search/?q=sheep&i=99202) icon
* Christopher Reyes for the [megaphone](https://thenounproject.com/search/?q=megaphone&i=11770) icon
* Brent Jackson for the [loading](http://jxnblk.com/loading/) svg
