![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/query', require('query-service'));
```

### configuration

for heroku, follow
[postgres' installation instructions](https://elements.heroku.com/addons/heroku-postgresql)

```bash
export DATABASE_URL=$(echo $CP_DATABASE_URL)
```
