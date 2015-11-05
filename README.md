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
