import {newNoop} from './utils';

export interface LogGeneratorFunction {
    (name: string): Logger;
}

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

function timestamp(): string {
    return `${(new Date()).toJSON()}`;
}

function logFn(name: string, fn: string): LogFunction {
    return function (...args: Array<any>): void {
        args[0] = `[${timestamp()}] ${name}: ${args[0]}`;
        console[fn].apply(console, args);
    };
}

export function factory(enabled: Boolean = true): LogGeneratorFunction {
    return function (name: string): Logger {
        var log = <Logger>(enabled ? logFn(name, 'info') : newNoop());

        log.error = <LogFunction>(enabled ? logFn(name, 'error') : newNoop());
        log.info = <LogFunction>(enabled ? logFn(name, 'info') : newNoop());
        log.log = <LogFunction>(enabled ? logFn(name, 'log') : newNoop());
        log.warn = <LogFunction>(enabled ? logFn(name, 'warn') : newNoop());

        return log;
    };
};

export var logger: LogGeneratorFunction = (function () {
    const create = factory((<any>window).DEBUGGING);
    return name => create(name);
})();

export default logger = logger;
