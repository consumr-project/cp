import { Sequelize } from 'sequelize';
import * as config from 'acm';
import Connection = require('sequelize');
import debug = require('debug');

export type DatabaseConnection = Sequelize;

export default (c = config): DatabaseConnection => {
    var env = process.env;

    if (
        env.POSTGRES_HOST &&
        env.POSTGRES_PASSWORD &&
        env.POSTGRES_USER &&
        env.POSTGRES_DB
    ) {
        return new Connection(
            env.POSTGRES_DB,
            env.POSTGRES_USER,
            env.POSTGRES_PASSWORD,
            {
                logging: debug('cp:service:dbms'),
                pool: c('database.pool'),
                host: env.POSTGRES_HOST,
                dialect: 'postgres'
            }
        );
    } else {
        return new Connection(c('database.url'), {
            logging: debug('cp:service:dbms'),
            pool: c('database.pool')
        });
    }
};
