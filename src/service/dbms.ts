import { Sequelize } from 'sequelize';
import * as config from 'acm';
import Connection = require('sequelize');
import debug = require('debug');

export type DatabaseConnection = Sequelize;

export default (c = config): DatabaseConnection =>
    new Connection(c('database.url'), {
        logging: debug('service:dbms'),
        pool: c('database.pool')
    });
