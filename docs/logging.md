## logging

### rollbar

rollbar is used for client-side loggin. only a token and environment identifier
are required as configuration. the `NODE_ENV` variable is checked for the
environment, with 'development' as the default.

```bash
heroku config:set ROLLBAR_TOKEN=$(echo $ROLLBAR_TOKEN)
heroku config:set NODE_ENV='development'
```
