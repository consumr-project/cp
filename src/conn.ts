import * as debug from 'debug';
import Sequelize = require('sequelize');
import config = require('acm');

export default (c = config) =>
    new Sequelize(c('database.url'), {
        logging: debug('service:query:exec'),
        pool: c('database.pool')
    });
