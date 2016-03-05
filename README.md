![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

[![Build Status](https://travis-ci.org/consumr-project/user-service.svg?branch=master)](https://travis-ci.org/consumr-project/user-service)

### usage

this service is meant to be mounted into the
[web-client](https://github.com/consumr-project/web-client)

```js
app.use('/user', require('user-service'));
```

### test
```bash
make test TEST_SERVICE_URL=http://localhost:3100 TEST_AUTH_URL=http://localhost:3100/auth
```
