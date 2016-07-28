import * as config from 'acm';
import Sequelize = require('sequelize');
import debug = require('debug');

export default (c = config) =>
    new Sequelize(c('database.url'), {
        logging: debug('service:dbms'),
        pool: c('database.pool')
    });
