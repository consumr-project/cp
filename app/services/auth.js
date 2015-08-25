/* global FirebasePassportLogin */
angular.module('tcp').service('Auth', [
    'DEBUGGING',
    'CONFIG',
    'logger',
    'store',
    function (DEBUGGING, CONFIG, logger, store) {
        'use strict';

        var log = logger('auth');

        var PROVIDER = {
            LINKEDIN: 'linkedin'
        };

        var ERROR = {
            EXPIRED_TOKEN: 'EXPIRED_TOKEN'
        };

        var auth = new FirebasePassportLogin(store, function (err, user) {
            if (err && err.code !== ERROR.EXPIRED_TOKEN) {
                log.error('login error', err);
                Auth.USER = null;
            } else if (err) {
                log('session timeout');
                Auth.USER = null;
            } else if (user) {
                log('user login', user);
                Auth.USER = user;
            } else {
                log('user logout');
                Auth.USER = null;
            }
        }, CONFIG.auth.url);

        var Auth = {
            PROVIDER: PROVIDER,
            login: login
        };

        /**
         * @param {String} provider
         */
        function login(provider) {
            return auth.login(provider);
        }

        if (DEBUGGING) {
            window.Auth = Auth;
        }

        return Auth;
    }
]);
