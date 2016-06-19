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

### tests

`make test` will run (most) tests. see [./test/README.md](test/README.md) for
additional documentation.

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
export TRELLO_BOARD_ID='...'
export TRELLO_KEY='...'
export TRELLO_LIST_ID='...'
export TRELLO_TOKEN='...'
```

### thanks for content

* Alain LOUBET for the [alert](https://thenounproject.com/search/?q=warning&i=14055) icon
* Andrew Sivko for the [add comment](https://thenounproject.com/search/?q=add%20comment&i=24079) icon
* Arthur Shlain for the [world](https://thenounproject.com/search/?q=world&i=292103) icon
* Austin Condiff for the [menu](https://thenounproject.com/search/?q=hamburger&i=70916) icon
* Brent Jackson for the [loading](http://jxnblk.com/loading/) icon
* Christopher Reyes for the [megaphone](https://thenounproject.com/search/?q=megaphone&i=11770) icon
* Creative Stall for the [pencil](https://thenounproject.com/search/?q=pencil&i=382196) icon
* Danil Polshin for the [pizza](https://thenounproject.com/term/pizza/108104/) icon
* Edward Boatman for the [face](https://thenounproject.com/search/?q=face&i=67226) icon
* Herbert Spencer for the [hammer](https://thenounproject.com/search/?q=hammer&i=333481) icon
* Leif Michelsen for the [question mark](https://thenounproject.com/search/?q=question+mark&i=447554) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
* Nikita Kozin for the [bell](https://thenounproject.com/search/?q=bell&i=304492) icon
* Rafaël Massé for the [link](https://thenounproject.com/search/?q=link&i=49479) icon
* Richard Schumann for the [warning](https://thenounproject.com/search/?q=warning&i=50611) icon
* Sascha Elmers for the [sheep](https://thenounproject.com/search/?q=sheep&i=99202) icon
* To Uyen for the [book](https://thenounproject.com/search/?q=book&i=249760) icon
* artworkbean for the [star](https://thenounproject.com/search/?q=star&i=101463) icon

### thanks for services

* development/free mongodb hosted by [mongolab](https://mongolab.com/)
