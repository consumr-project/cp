![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

`make install service` will install depedencies and start search services.

### configuration

for monitoring setup see
[web-client](https://github.com/consumr-project/web-client/blob/master/docs/monitoring.md)'s
documentation

### deploying to heroku

this is a background process, so no need to make heroku bing to web ports:
```bash
heroku ps:scale web=0
heroku ps:scale worker=1
```

point to elasticsearch instance:

```
heroku config:set ELASTICSEARCH_HOST=$(echo $CP_FACET_FLOW_ES_HOST)
```

to build and run application in debug mode:

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false
heroku config:set DEBUG=*
```

development (free) elasticsearch hosting provided by
[facet flow](https://facetflow.com/)
