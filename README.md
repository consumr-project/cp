![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/query', require('query-service'));
```

### deploying to heroku

a local instance of postgres is expected. see
[services documentation](docs/services.md).
the following enviroment variables are needed to run:

```bash
heroku config:set DATABASE_NAME=$(echo $CP_DATABASE_NAME)
heroku config:set DATABASE_USERNAME=$(echo $CP_DATABASE_USERNAME)
heroku config:set DATABASE_PASSWORD=$(echo $CP_DATABASE_PASSWORD)
```
