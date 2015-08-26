/* global FirebasePassportLogin */
angular.module('tcp').service('Auth', [
    'DEBUGGING',
    'CONFIG',
    'logger',
    'store',
    'lodash',
    function (DEBUGGING, CONFIG, logger, store, _) {
        'use strict';

        var Auth, auth;

        var log = logger('auth'),
            events = {};

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

        Auth = {
            PROVIDER: PROVIDER,
            login: login,
            logout: logout,
            on: addListener
        };

        auth = new FirebasePassportLogin(store, function (err, user) {
            if (err && err.code !== ERROR.EXPIRED_TOKEN) {
                log.error('login error', err);
                Auth.USER = null;
                triggerListeners(EVENT.ERROR);
            } else if (err) {
                log('session timeout');
                Auth.USER = null;
                triggerListeners(EVENT.TIMEOUT);
            } else if (user) {
                log('user login', user);
                Auth.USER = user;
                triggerListeners(EVENT.LOGIN);
            } else {
                log('user logout');
                Auth.USER = null;
                triggerListeners(EVENT.LOGOUT);
            }
        }, CONFIG.auth.url);

        /**
         * @param {String} name
         * @param {Array} args
         */
        function triggerListeners(name, args) {
            _.each(events[name], function (fn) {
                fn.apply(null, args || []);
            });
        }

        /**
         * @param {String} name
         * @param {Function} handler
         * @return {Function} remove listener
         */
        function addListener(name, handler) {
            if (!(name in events)) {
                events[name] = [];
            }

            events[name].push(handler);

            return function () {
                _.remove(events[name], function (fn) {
                    return handler === fn;
                });
            };
        }

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
