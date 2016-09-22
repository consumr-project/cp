import { Sequelize } from 'sequelize';
import { logger } from '../log';
import * as config from 'acm';
import Connection = require('sequelize');

export type DatabaseConnection = Sequelize;

const log = logger(__filename);
function do_log() {
    return log.debug.apply(log, arguments);
}

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
                logging: do_log,
                pool: c('database.pool'),
                host: env.POSTGRES_HOST,
                dialect: 'postgres'
            }
        );
    } else {
        return new Connection(c('database.url'), {
            logging: do_log,
            pool: c('database.pool')
        });
    }
};
