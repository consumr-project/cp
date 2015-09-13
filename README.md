![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/minond/the-consumer-project.svg)](https://travis-ci.org/minond/the-consumer-project)

### usage

local installation. declaring `DEBUG=*` will enable sourcemaps for `build` and
server logging and client side perf for `run`.

```bash
DEBUG=* make build
DEBUG=* make run
```

deploying to heroku (in development mode):

```bash
heroku config:set LINKEDIN_CLIENT_SECRET=`echo $LINKEDIN_CLIENT_SECRET`
heroku config:set LINKEDIN_CLIENT_ID=`echo $LINKEDIN_CLIENT_ID`
heroku config:set FIREBASE_SECRET=`echo $FIREBASE_SECRET`
heroku config:set EMBEDLY_API_KEY=`echo $EMBEDLY_API_KEY`
heroku config:set SESSION_DOMAIN=http://the-consumer-project.herokuapp.com/
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set DEBUG=*
make deploy
```

### configuration

configuration is retrieved using [acm](https://www.npmjs.com/package/acm).
expected configuration variables:

- `debug` (default: `false`)
- `firebase.secret`
- `firebase.url` (in: `config/`)
- `linkedin.client_id`
- `linkedin.client_secret`
- `port` (default: `3000`)
- `session.cookie` (in: `config/`)
- `session.domain` (in: `config/`)

### thanks

* Edward Boatman for the [face icon](https://thenounproject.com/search/?q=face&i=67226)
