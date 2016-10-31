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

### external services

- hosting: [AWS](https://aws.amazon.com/)
- postgres: [Compose](https://www.compose.com/)
- mongodb: [mLab](https://mlab.com/)
- error logs: [Rollbar](https://rollbar.com/)
- content extraction: [embed.ly](http://embed.ly/)
- emails: [mailgun](http://www.mailgun.com/)

<!-- &#45; rabbitmq: [CloudAMQP](https://www.cloudamqp.com/) -->
