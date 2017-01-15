import { nonce, encrypt } from './crypto';
import { option, is_set } from './utilities';
import { createNamespace as create,
    getNamespace as retrieve } from 'continuation-local-storage';

const NS = 'org.cp.toe';
const LABEL = 'toe';
const DELIM = '-';
const LEN = 12;

const KEY_SESSION = 'session';
const KEY_REQUEST = 'request';
const KEY_HANDLER = 'handler';

export type Part = string;

export class Toe {
    public session: Part;
    public request: Part;
    public handler: Part;

    constructor(session: string) {
        if (session) {
            this.session = part(session, KEY_SESSION);
        }
    }

    for_request(request: string = nonce()): Toe {
        let toe = new Toe('');
        toe.session = this.session;
        toe.request = part(request, KEY_REQUEST);
        return toe;
    }

    for_handler(handler: string = nonce()): Toe {
        let toe = new Toe('');
        toe.session = this.session;
        toe.request = this.request;
        toe.handler = part(handler, KEY_HANDLER);
        return toe;
    }

    clone(): Toe {
        let toe = new Toe('');
        toe.session = this.session;
        toe.request = this.request;
        toe.handler = this.handler;
        return toe;
    }

    toString(): string {
        let { session, request, handler } = this;
        return [session, request, handler]
            .filter(is_set)
            .join(DELIM);
    }
}

function part(name: string, key: string): Part {
    return encrypt(name, key).substr(0, LEN);
}

export function get(): Toe {
    let ns = retrieve(NS) || create(NS);
    let toe = option(ns.get(LABEL))
        .get_or_else(new Toe(nonce()));

    ns.run(() => ns.set(LABEL, toe));
    return toe.clone();
}

export function initialize(session: string, tick: Function): void {
    let ns = retrieve(NS) || create(NS);

    let toe = new Toe(part(session, KEY_SESSION))
        .for_request(nonce());

    ns.run(() => {
        ns.set(LABEL, toe);
        tick(null, toe.clone());
    });
}
