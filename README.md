![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/extract', require('extract-service'));
```

### configuration

the following enviroment variables are needed to run:

```bash
export EMBEDLY_API_KEY=$(echo $EMBEDLY_API_KEY)
```
