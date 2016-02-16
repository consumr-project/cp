![consumerproject](http://i.imgur.com/iLlaWxJ.png)

A crowd sourced platform to help us all learn a little bit more about the
things we buy, sell, and consume every day.

### usage

`make install service` will install depedencies and start search services.

### configuration

for monitoring setup see
[web-client](https://github.com/consumr-project/web-client#new-relic)'s
documentation

mongodb configuration

```bash
export MONGO_URL='utl to mongo db instance with database name'
```

email transport configuration

```bash
export EMAIL_SERVICE_NAME=$(echo $CP_EMAIL_SERVICE_NAME)
export EMAIL_SERVICE_USER=$(echo $CP_EMAIL_SERVICE_USER)
export EMAIL_SERVICE_PASS=$(read -p "email transport password: " password; echo $password)
```

to build and run application in debug mode:

```bash
export NPM_CONFIG_PRODUCTION=false
export DEBUG=*
```

### heroku

this is a background process, so no need to make heroku bing to web ports:

```bash
heroku ps:scale web=0
heroku ps:scale worker=1
```

### services

#### mongodb

mongolab provides a free [MongoDB instance](https://mongolab.com/) that works
just fine for a development enviroment.

#### rabbitmq

heroku provides a free [RabbitMQ
plugin](https://elements.heroku.com/addons/rabbitmq-bigwig) which can be
installed with the following command:

```bash
heroku addons:create rabbitmq-bigwig:pipkin
```

a local instance of RabbitMQ can be downloaded and started by running `make rabbitmq`

### thanks

* development (free) emails sent by [mailgun](http://www.mailgun.com/)
* development (free) mongodb hosted by [mongolab](https://mongolab.com/)

### reading

* [HTML Email Basics](http://templates.mailchimp.com/getting-started/html-email-basics/) - Mail Chimp
* [20 Email Design Best Practices and Resources for Beginners](http://code.tutsplus.com/tutorials/20-email-design-best-practices-and-resources-for-beginners--net-7309) - tutsplus
