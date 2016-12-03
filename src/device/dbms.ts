import { Sequelize as SequelizeInstance } from 'sequelize';
import * as SequelizeBase from 'sequelize';
import { logger } from '../log';
import { Message } from '../record/message';
import * as config from 'acm';
import Connection = require('sequelize');

const log = logger(__filename);

export type DbmsDevice = SequelizeInstance;

export interface Model<T> extends SequelizeBase.Model<Message & T, T> {}

export default (c = config): DbmsDevice => {
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

function do_log() {
    return log.debug.apply(log, arguments);
}
