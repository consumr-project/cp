import Sequelize = require('sequelize');
import config = require('acm');
import debug = require('debug');

export default (c = config) =>
    new Sequelize(c('database.url'), {
        logging: debug('service:query:exec'),
        pool: c('database.pool')
    });
