# the consumer project

local installation

```bash
make build
DEBUG=* make run
```

deploying to heroku (in development mode):

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set DEBUG=*
make deploy
```
