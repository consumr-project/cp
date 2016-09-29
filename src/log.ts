import { Logger, LoggerInstance, TransportInstance,
    TransportOptions, transports } from 'winston';

import { empty } from './utilities';
import { sep } from 'path';
import { template, padEnd as pad } from 'lodash';
import * as config from 'acm';

const CWD = process.cwd() + sep;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PAD_LEN_LEVEL = 7;

declare module 'winston' {
    interface Transports {
        [key: string]: TransportInstance;
    }
}

interface TransportConfig {
    type: string;
    format: string;
}

interface LogItem {
    level: string;
    message?: string;
    meta?: Object;
    timestamp: () => number;
}

function formatter(filename: string, format: string) {
    var name = filename.replace(CWD, '');
    var log = template(format, { interpolate: /{{([\s\S]+?)}}/g });

    return function (opt: LogItem) {
        var time = new Date().toISOString();
        var level = pad(opt.level.toUpperCase(), PAD_LEN_LEVEL);
        var message = opt.message || '';
        var meta = empty(opt.meta) ? JSON.stringify(opt.meta) : '';
        var str = [message, meta].join(' ').trim();

        return log({
            name,
            time,
            level,
            message,
            meta,
            str,
        });
    };
}

export function logger(name: string): LoggerInstance {
    var logger = new Logger({
        exitOnError: false,
        transports: config('logging.transports').map((transport: TransportConfig): TransportInstance =>
            new transports[transport.type](<TransportOptions>{
                formatter: formatter(name, transport.format),
            }))
    });

    logger.level = LOG_LEVEL;
    return logger;
}
