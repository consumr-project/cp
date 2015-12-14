![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/auth', require('auth-service'));
```

### configuration

the following enviroment variables are needed to run:

```bash
export LINKEDIN_CLIENT_ID=$(echo $LINKEDIN_CLIENT_ID)
export LINKEDIN_CLIENT_SECRET=$(echo $LINKEDIN_CLIENT_SECRET)
export LINKEDIN_CLIENT_SECRET=$(echo $LINKEDIN_CLIENT_SECRET)
```
