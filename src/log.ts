import { empty } from './utilities';
import { Logger, LoggerInstance, transports } from 'winston';
import { sep } from 'path';

const CWD = process.cwd() + sep;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

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
        var level = opt.level.toUpperCase();
        var message = opt.message || '';
        var meta = empty(opt.meta) ? JSON.stringify(opt.meta) : '';
        var str = [message, meta].join(' ');
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
