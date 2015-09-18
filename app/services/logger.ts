import {newNoop} from './utils';

export interface LogFunction {
    (...args: Array<any>): void;
}

export interface Logger {
    <LogFunction>(...args: Array<any>);
    error: LogFunction;
    info: LogFunction;
    log: LogFunction;
    warn: LogFunction;
}

function label(name: string): string {
    return `[${name}]`;
}

function timestamp(): string {
    return `(${(new Date()).toJSON()})`;
}

function logFn(name: string, fn: string): LogFunction {
    return function (...args: Array<any>): void {
        args[0] = `${label(name)} ${args[0]} ${timestamp()}`;
        console[fn].apply(console, args);
    };
}

export default function factory(enabled: Boolean = true): (name: string) => Logger {
    return function (name: string): Logger {
        var log = <Logger>(enabled ? logFn(name, 'info') : newNoop());

        log.error = <LogFunction>(enabled ? logFn(name, 'error') : newNoop());
        log.info = <LogFunction>(enabled ? logFn(name, 'info') : newNoop());
        log.log = <LogFunction>(enabled ? logFn(name, 'log') : newNoop());
        log.warn = <LogFunction>(enabled ? logFn(name, 'warn') : newNoop());

        return log;
    };
};
