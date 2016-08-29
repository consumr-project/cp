import { Sequelize } from 'sequelize';
import * as config from 'acm';
import Connection = require('sequelize');
import debug = require('debug');

export type DatabaseConnection = Sequelize;

const docker_url = 'postgres://' + process.env.POSTGRES_USER +
    ':' + process.env.POSTGRES_PASSWORD +
    '@' + process.env.POSTGRES_PORT_5432_TCP_ADDR +
    ':' + process.env.POSTGRES_PORT_5432_TCP_PORT +
    '/' + process.env.POSTGRES_DB;

export default (c = config): DatabaseConnection =>
    new Connection(c('database.url') || docker_url, {
        logging: debug('cp:service:dbms'),
        pool: c('database.pool')
    });
