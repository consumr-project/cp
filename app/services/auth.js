/* global FirebasePassportLogin */
angular.module('tcp').service('Auth', [
    'DEBUGGING',
    'CONFIG',
    'logger',
    'store',
    'utils',
    'lodash',
    function (DEBUGGING, CONFIG, logger, store, utils, _) {
        'use strict';

        var Auth, auth;

        var log = logger('auth'),
            events = utils.createListener();

        var EVENT = {
            LOGIN: 'login',
            LOGOUT: 'logout',
            TIMEOUT: 'timeout',
            ERROR: 'error'
        };

        var PROVIDER = {
            LINKEDIN: 'linkedin'
        };

        var ERROR = {
            EXPIRED_TOKEN: 'EXPIRED_TOKEN'
        };

        Auth = events.listener({
            PROVIDER: PROVIDER,
            EVENT: EVENT,
            login: login,
            logout: logout
        });

        auth = new FirebasePassportLogin(store, function (err, user) {
            if (err && err.code !== ERROR.EXPIRED_TOKEN) {
                log.error('login error', err);
                Auth.USER = null;
                events.trigger(EVENT.ERROR);
            } else if (err) {
                log('session timeout');
                Auth.USER = null;
                events.trigger(EVENT.TIMEOUT);
            } else if (user) {
                log('user login', user);
                Auth.USER = user;
                events.trigger(EVENT.LOGIN);
            } else {
                log('user logout');
                Auth.USER = null;
                events.trigger(EVENT.LOGOUT);
            }
        }, '/auth/');

        /**
         * @param {String} provider
         */
        function login(provider) {
            return auth.login(provider);
        }

        function logout() {
            return auth.logout();
        }

        if (DEBUGGING) {
            window.Auth = Auth;
        }

        return Auth;
    }
]);
