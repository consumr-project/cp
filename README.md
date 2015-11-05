![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

```js
/**
 * app: express
 * config: acm
 * fb: Firebase
 */
require('./node_modules/auth-service/src/main')(app);
require('./node_modules/auth-service/src/linkedin')(app, config, fb);
```

### deploying to heroku

the following enviroment variables are needed to run:

```bash
heroku config:set FIREBASE_SECRET=$(echo $FIREBASE_SECRET)
heroku config:set LINKEDIN_CLIENT_ID=$(echo $LINKEDIN_CLIENT_ID)
heroku config:set LINKEDIN_CLIENT_SECRET=$(echo $LINKEDIN_CLIENT_SECRET)
heroku config:set LINKEDIN_CLIENT_SECRET=$(echo $LINKEDIN_CLIENT_SECRET)
heroku config:set SESSION_DOMAIN=$(heroku apps:info -s | grep web-url | sed 's/web-url=//')
```
