# contributing to the consumr project

### running the app

start by installing [docker and docker compose](https://docs.docker.com/compose/install/).
the following commands will generate an environment variable file, build and
start the containers, and setup and migration the database:

```bash
./script/bootstrap env
docker-compose build
docker-compose up
./script/docker-database-setup
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
export CP_COOKIE_KEY='...'
export CP_SESSION_KEY='...'
export CP_CRYPTO_AUTH_TOKEN_KEY='...'
export CP_CRYPTO_USER_EMAIL_KEY='...'
export DATABASE_URL='postgres://...'
export EMBEDLY_API_KEY='...'
export ROLLBAR_TOKEN='...'
export GOOGLE_ANALYTICS_ACCOUNT_ID='...'
export LINKEDIN_CLIENT_ID='...'
export LINKEDIN_CLIENT_SECRET='...'
export MONGO_URL='mongodb://...'
export TRELLO_BOARD_ID='...'
export TRELLO_KEY='...'
export TRELLO_LIST_ID='...'
export TRELLO_TOKEN='...'
```

if `MONGO_URL` or `DATABASE_URL` are not found the following variables will be
used:

```bash
export POSTGRES_DB='...'
export POSTGRES_HOST='...'
export POSTGRES_PASSWORD='...'
export POSTGRES_USER='...'
export MONGO_COLLECTION='...'
export MONGO_HOST='...'
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
