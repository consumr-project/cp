![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/minond/the-consumer-project.svg)](https://travis-ci.org/minond/the-consumer-project)

### usage

`make build server` will install depedencies, compile source, and start a web
server. declaring `DEBUG=*` will enable sourcemaps for `build` and server
logging and client side perf for `server`.

### configuration

configuration is retrieved using [acm](https://www.npmjs.com/package/acm).
expected configuration variables:

- `debug` (default: `false`)
- `embedly.api_key`
- `firebase.url` (in: `config/firebase.yml`)
- `port` (default: `3000`)

### deploying to heroku

the following enviroment variables are needed to run:

```bash
heroku config:set EMBEDLY_API_KEY=$(echo $EMBEDLY_API_KEY)
```

build and run application in debug mode:

```
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set DEBUG=*
```

finally, push to heroku (`make deploy-heroku` or `git push heroku origin`)

### thanks

* Edward Boatman for the [face](https://thenounproject.com/search/?q=face&i=67226) icon
* Austin Condiff for the [menu](https://thenounproject.com/search/?q=hamburger&i=70916) icon
* Michael Zenaty for the [magnifying glass](https://thenounproject.com/search/?q=search&i=21796) icon
