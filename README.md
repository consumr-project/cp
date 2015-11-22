![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/auth', require('auth-service'));
```

### deploying to heroku

the following enviroment variables are needed to run:

```bash
heroku config:set FIREBASE_SECRET=$(echo $FIREBASE_SECRET)
heroku config:set LINKEDIN_CLIENT_ID=$(echo $LINKEDIN_CLIENT_ID)
heroku config:set LINKEDIN_CLIENT_SECRET=$(echo $LINKEDIN_CLIENT_SECRET)
heroku config:set LINKEDIN_CLIENT_SECRET=$(echo $LINKEDIN_CLIENT_SECRET)
```
