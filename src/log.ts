import { empty } from './utilities';
import { Logger, LoggerInstance, transports } from 'winston';
import { sep } from 'path';
import { padEnd as pad } from 'lodash';

const CWD = process.cwd() + sep;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PAD_LEN_LEVEL = 7;

interface LogItem {
    level: string;
    message?: string;
    meta?: Object;
    timestamp: () => number;
}

function cli_formatter(filename: string) {
    var name = filename.replace(CWD, '');

    return function (opt: LogItem) {
        var time = new Date().toISOString();
        var level = pad(opt.level.toUpperCase(), PAD_LEN_LEVEL);
        var message = opt.message || '';
        var meta = empty(opt.meta) ? JSON.stringify(opt.meta) : '';
        var str = [message, meta].join(' ').trim();
        return `${time} ${level} [${name}] ${str}`;
    };
}

export function logger(name: string): LoggerInstance {
    var logger = new Logger({
        exitOnError: false,
        transports: [
            new transports.Console({
                formatter: cli_formatter(name)
            })
        ],
    });

    logger.level = LOG_LEVEL;
    return logger;
}
