![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/consumr-project/cp.svg)](https://travis-ci.org/consumr-project/cp)

### usage

```
foreman start
make install
make
make server
```

### test

the following targes are available: `test-e2e`, `test-integration`,
`test-unit`, and `test` which triggers the first three.  the e2e tests require
that webdriver be runnig which can be done with `make test-start-webdriver`.
the integration tests require the server to be running and a `TEST_SERVICE_URL`
environment variable to be declared pointing to the root of the server
(`http://localhost:3000`). no external processes are required to run the unit
tests.

```bash
make test-start-webdriver
TEST_SERVICE_URL=http://localhost:3000 make test
```

### configuration

configuration is retrieved using [acm](https://www.npmjs.com/package/acm). see
`config/` directory for additional configuration options (linkedin, embedly,
monitoring, etc.). to build and run application in debug mode:

```bash
export NPM_CONFIG_PRODUCTION=false
export DEBUG=*
export PORT=3000
```

additional services and service providers:

```bash
export CRUNCHBASE_API_KEY='...'
export DATABASE_URL='postgres://...'
export ELASTICSEARCH_HOST='http://...'
export EMAIL_SERVICE_NAME='...'
export EMAIL_SERVICE_PASS='...'
export EMAIL_SERVICE_USER='...'
export EMBEDLY_API_KEY='...'
export GOOGLE_ANALYTICS_ACCOUNT_ID='...'
export LINKEDIN_CLIENT_ID='...'
export LINKEDIN_CLIENT_SECRET='...'
export MONGO_URL='mongodb://...'
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

#### rollbar

rollbar is used for client-side loggin. only a token and environment identifier
are required as configuration. the `NODE_ENV` variable is checked for the
environment, with 'development' as the default.

```bash
export ROLLBAR_TOKEN='...'
export NODE_ENV='development'
```
#### mongodb

mongolab provides a free [MongoDB instance](https://mongolab.com/) that works
just fine for a development enviroment. a local instance of mongo can be
downloaded and started by running `make mongodb`

#### postgres

heroku provides a free
[Postgres plugin](https://elements.heroku.com/addons/heroku-postgresql). a
local instance of Postgres can be downloaded and started by running
`make postgres`

#### rabbitmq

heroku provides a free [RabbitMQ
plugin](https://elements.heroku.com/addons/rabbitmq-bigwig) which can be
installed with the command below. a local instance of RabbitMQ can be
downloaded and started by running `make rabbitmq`

```bash
heroku addons:create rabbitmq-bigwig:pipkin
```

### thanks for content

* Edward Boatman for the [face](https://thenounproject.com/search/?q=face&i=67226) icon
* Austin Condiff for the [menu](https://thenounproject.com/search/?q=hamburger&i=70916) icon
* To Uyen for the [book](https://thenounproject.com/search/?q=book&i=249760) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
* artworkbean for the [star](https://thenounproject.com/search/?q=star&i=101463) icon
* Rafaël Massé for the [link](https://thenounproject.com/search/?q=link&i=49479) icon
* Herbert Spencer for the [hammer](https://thenounproject.com/search/?q=hammer&i=333481) icon
* Arthur Shlain for the [world](https://thenounproject.com/search/?q=world&i=292103) icon
* Richard Schumann for the [warning](https://thenounproject.com/search/?q=warning&i=50611) icon
* Sascha Elmers for the [sheep](https://thenounproject.com/search/?q=sheep&i=99202) icon
* Christopher Reyes for the [megaphone](https://thenounproject.com/search/?q=megaphone&i=11770) icon
* Brent Jackson for the [loading](http://jxnblk.com/loading/) svg

### thanks for services

* development/free elasticsearch hosting provided by [facet flow](https://facetflow.com/)
* development/free emails sent by [mailgun](http://www.mailgun.com/)
* development/free mongodb hosted by [mongolab](https://mongolab.com/)
