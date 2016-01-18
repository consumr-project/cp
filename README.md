![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/search', require('search-service'));
```

and also has a background process (indexer) that can be ran as a stand-alone
service.

### configuration

for monitoring setup see
[web-client](https://github.com/consumr-project/web-client#new-relic)'s
documentation

point to elasticsearch instance:

```bash
export ELASTICSEARCH_HOST=$(echo $CP_FACET_FLOW_ES_HOST)
```

to build and run application in debug mode:

```bash
export NPM_CONFIG_PRODUCTION=false
export DEBUG=*
```

### heroku

run background process (indexer) as a stand-alone service:

```bash
heroku ps:scale web=0
heroku ps:scale worker=1
```

a local instance of Elasticsearch can be downloaded and started by running
`make elasticsearch`

### thanks

* development (free) elasticsearch hosting provided by [facet flow](https://facetflow.com/)
