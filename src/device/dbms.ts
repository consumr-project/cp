import { Sequelize } from 'sequelize';
import { logger } from '../log';
import * as config from 'acm';
import Connection = require('sequelize');

const log = logger(__filename);
function do_log() {
    return log.debug.apply(log, arguments);
}

export class DbmsDevice extends Connection {}

export default (c = config): DbmsDevice => {
    var env = process.env;

    if (
        env.POSTGRES_HOST &&
        env.POSTGRES_PASSWORD &&
        env.POSTGRES_USER &&
        env.POSTGRES_DB
    ) {
        return new DbmsDevice(
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
        return new DbmsDevice(c('database.url'), {
            logging: do_log,
            pool: c('database.pool')
        });
    }
};
