# the consumer project

[consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

local installation. declaring `DEBUG=*` will enable sourcemaps for `build` and
server logging and client side perf for `run`.

```bash
DEBUG=* make build
DEBUG=* make run
```

deploying to heroku (in development mode):

```bash
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
- `session.auth.callback_url` (in: `config/`)
- `session.auth.cookie` (in: `config/`)
- `session.auth.url` (in: `config/`)

### thanks

* Edward Boatman for the [face icon](https://thenounproject.com/search/?q=face&i=67226)
