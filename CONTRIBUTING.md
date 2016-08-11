# contributing to the consumr project

first install [https://www.postgresql.org/download/](postgres) version 9.4.5
then run `foreman start` to download and start addtional services required by
the app. while that's running run `make install` to install all code
dependencies. `make` will build the project, and `make server` will start the
application web server:

```
foreman start
make install
make
make server
```

before running `make server` run the `./config/bootstrap` script. this will
check your environment for all required environment variables. without these
the app will not work or may not event start up at all. see the configuration
section below for additional details.

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
export CP_COOKIE_KEY='...'
export CP_SESSION_KEY='...'
export CP_CRYPTO_AUTH_TOKEN_KEY='...'
export CP_CRYPTO_USER_EMAIL_KEY='...'
export DATABASE_URL='postgres://...'
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

### tests and linters

`make test` will run (most) tests. see [./test/README.md](test/README.md) for
additional documentation. `make lint` will lint the codebase.

### build

`make` will build the whole application. there are targets for specific
sections in the app (see the make file for this). also, setting a `DEBUG=*`
environment variable (`make DEBUG=*`) will build parts of the code base in
development mode and give you things like source maps, unminified code, nicer
error messages, and that's about it.

### deploying to your heroku account

login with heroku, create your app, then run `./script/bootstrap heroku`. this
will set the build pack and install any addons the app needs. it will also
check for the required environment variables and prompt you to set them if they
do not exist. after running the script push to the heroku branch and then run
the following scripts if you want some data (this isn't required):

```bash
heroku run ./script/generate app:user
heroku run ./script/generate app:tags
heroku run ./script/generate app:products
```
