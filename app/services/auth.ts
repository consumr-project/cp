/// <reference path="../typings.d.ts"/>

import {Listener, createListener} from './utils';
import {Logger} from './logger';
import logger from './logger';

const ERROR_EXPIRED_TOKEN: string = 'EXPIRED_TOKEN';

export enum EVENT {
    LOGIN,
    LOGOUT,
    TIMEOUT,
    ERROR,
};

export class PROVIDER {
    static LINKEDIN: string = 'linkedin';
}

export interface Session extends Listener {
    USER?: any;
    login(provider: PROVIDER): void;
    logout(): void;
}

export function session(root: string, store: Firebase, debugging: Boolean = false): Session {
    var log: Logger = logger(debugging)('auth'),
        events: Listener = createListener(),
        session: Session = events.listener({}),
        auth: FirebasePassportLoginStatic;

    session.login = function (provider: PROVIDER) {
        auth.login(provider);
    };

    session.logout = function () {
        auth.logout();
    };

    auth = new FirebasePassportLogin(store, function (err: FirebasePassportLoginError, user) {
        if (err && err.code !== ERROR_EXPIRED_TOKEN) {
            log.error('login error', err);
            session.USER = null;
            events.trigger(EVENT.ERROR);
        } else if (err) {
            log('session timeout');
            session.USER = null;
            events.trigger(EVENT.TIMEOUT);
        } else if (user) {
            log('user login', user);
            session.USER = user;
            events.trigger(EVENT.LOGIN);
        } else {
            log('user logout');
            session.USER = null;
            events.trigger(EVENT.LOGOUT);
        }
    }, root);

    return session;
};
