import * as EVENTS from '../events';
import { logger } from '../log';
import { includes } from 'lodash';
import { EventEmitter } from 'events';

const log = logger(__filename);
const evs = Object.keys(EVENTS).map(k => EVENTS[k]);

function validate(ev: string) {
    if (!includes(evs, ev)) {
        log.error('invalid event used', new InvalidEventError(ev));
    }
}

export class InvalidEventError extends Error {
    constructor(ev_name: string) {
        super();
        this.name = 'InvalidEventError';
        this.message = `Invalid event: ${ev_name}`;
    }
}

export class Emitter extends EventEmitter {
    on(ev: string, action: Function): this {
        validate(ev);
        super.on(ev, action);
        return this;
    }

    once(ev: string, action: Function): this {
        validate(ev);
        super.once(ev, action);
        return this;
    }

    emit(ev: string, ...args: any[]): boolean {
        validate(ev);

        try {
            return super.emit(ev, ...args);
        } catch (err) {
            log.error('why am I getting an error?', err);
            return false;
        }
    }
}

export const emitter = new Emitter();
