![consumerproject](http://i.imgur.com/iLlaWxJ.png)

a crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/consumr-project/cp.svg?branch=master)](https://travis-ci.org/consumr-project/cp)
# contributing to the consumr project

### running the app

start by installing [docker and docker compose](https://docs.docker.com/compose/install/).
the following commands will generate an environment variable file, build and
start the containers, and setup and migration the database:

```bash
./script/docker-setup
docker-compose up
```

the container's directory where the code live is linked to the root of the code
base on the host, so local changes will reflected in the container.

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
export CP_COOKIE_KEY=               # random string used to encript cookies
export CP_CRYPTO_AUTH_TOKEN_KEY=    # random string used to encript tokens
export CP_CRYPTO_USER_EMAIL_KEY=    # random string used to encript emails
export CP_ENV=                      # environment name/label
export CP_SESSION_KEY=              # random string used to encript sessions
export CP_URL=                      # url cp server is accessible from
export EMAIL_SERVICE_HOST=
export EMAIL_SERVICE_PASS=
export EMAIL_SERVICE_USER=
export EMBEDLY_API_KEY=
export FACEBOOK_APP_ID=
export FILES_AVATARS_IMGUR_ALBUM_ID=
export FILES_AVATARS_IMGUR_CLIENT_ID=
export FILES_AVATARS_IMGUR_PASSWORD=
export FILES_AVATARS_IMGUR_USERNAME=
export GOOGLE_ANALYTICS_ACCOUNT_ID=
export GOOGLE_RECAPTCHA_KEY=
export GOOGLE_RECAPTCHA_SECRET=
export LINKEDIN_CLIENT_ID=
export LINKEDIN_CLIENT_SECRET=
export LOG_LEVEL                    # log level for winston
export ROLLBAR_TOKEN=
export TRELLO_BOARD_ID=
export TRELLO_KEY=
export TRELLO_LIST_ID=
export TRELLO_TOKEN=
```

for database connections, we either check for `*_URL` or more specific
variables:

```bash
export DATABASE_URL=
export MONGO_URL=
````

```bash
export MONGO_COLLECTION=
export MONGO_HOST=
export POSTGRES_DB=
export POSTGRES_HOST=
export POSTGRES_PASSWORD=
export POSTGRES_USER=
```

other configuration variables you might care about:

```bash
export CP_AUTH_LOCKDOWN=            # require that new users be authorized
export CP_ADMIN_EMAILS=             # system admin emails, comma separated
export SERVER_JIT_COMPRESSION=      # enable express to compress responses
export SERVER_VIEW_CACHING=         # enable express and swig to cache views
export CLIENT_DEBUG_INFO=           # load the main view with debug enabled
```

### tests and linters

`make test` will run (most) tests. see [./test/README.md](test/README.md) for
additional documentation. `make lint` will lint the codebase.

### build

`make` will build the whole application. there are targets for specific
sections in the app (see the make file for this). also, setting a `DEBUG=*`
environment variable (`make DEBUG=*`) will build parts of the code base in
development mode and give you things like source maps, unminified code, nicer
error messages, and that's about it.

### production services

- hosting: [DigitalOcean](https://www.digitalocean.com/)
- postgres: [Compose](https://www.compose.com/)
- mongodb: [mLab](https://mlab.com/)
- error tracking: [Rollbar](https://rollbar.com/)
- content extraction: [embed.ly](http://embed.ly/)
- emails: [mailgun](http://www.mailgun.com/)

### thanks for content

* Alain LOUBET for the [alert](https://thenounproject.com/search/?q=warning&i=14055) icon
* Aldric Rodríguez Iborra for the [ice cream](https://thenounproject.com/search/?q=ice+cream&i=422594) icon
* Aldric Rodríguez for the [doughnut](https://thenounproject.com/search/?q=doughnut&i=732935) icon
* Andrew Sivko for the [add comment](https://thenounproject.com/search/?q=add%20comment&i=24079) icon
* ArtWorkStar for the [plus](https://thenounproject.com/search/?q=plus&i=609027) icon
* Arthur Shlain for the [world](https://thenounproject.com/search/?q=world&i=292103) icon
* Austin Condiff for the [menu](https://thenounproject.com/search/?q=hamburger&i=70916) icon
* Brent Jackson for the [loading](http://jxnblk.com/loading/) icon
* Christopher Reyes for the [megaphone](https://thenounproject.com/search/?q=megaphone&i=11770) icon
* Creative Stall for the [pencil](https://thenounproject.com/search/?q=pencil&i=382196) icon
* Danil Polshin for the [pizza](https://thenounproject.com/term/pizza/108104/) icon
* Edward Boatman for the [camera](https://thenounproject.com/search/?q=camera&i=476) icon
* Edward Boatman for the [face](https://thenounproject.com/search/?q=face&i=67226) icon
* Edward Boatman for the [shopping cart](https://thenounproject.com/search/?q=shopping+cart&i=355) icon
* Juan León for the [dead fish](https://thenounproject.com/search/?q=dead+fish&i=95085) icon
* Kimmi Studio for the [check mark](https://thenounproject.com/search/?q=check&i=702757) icon
* Lee Mette for the [cactus](https://thenounproject.com/search/?q=broken+cactus&i=103375) icon
* Leif Michelsen for the [question mark](https://thenounproject.com/search/?q=question+mark&i=447554) icon
* Lloyd Humphreys for the [information](https://thenounproject.com/search/?q=information&i=96638) icon
* Maciej Świerczek for the [hammer](https://thenounproject.com/search/?q=hammer&i=188614) icon
* Marco Galtarossa for the [popsicle](https://thenounproject.com/search/?q=ice+cream&i=466295) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
* Nikita Kozin for the [bell](https://thenounproject.com/search/?q=bell&i=304492) icon
* Rafaël Massé for the [link](https://thenounproject.com/search/?q=link&i=49479) icon
* Richard Schumann for the [warning](https://thenounproject.com/search/?q=warning&i=50611) icon
* Ryzhkov Anton for the [soda spill](https://thenounproject.com/search/?q=spill&i=23127) icon
* Sascha Elmers for the [sheep](https://thenounproject.com/search/?q=sheep&i=99202) icon
* To Uyen for the [book](https://thenounproject.com/search/?q=book&i=249760) icon
* artworkbean for the [star](https://thenounproject.com/search/?q=star&i=101463) icon
