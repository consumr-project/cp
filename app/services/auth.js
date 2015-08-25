/* global FirebasePassportLogin */
angular.module('tcp').service('Auth', [
    'CONFIG',
    'store',
    function (CONFIG, store) {
        'use strict';

        var PROVIDER = {
            linkedin: 'linkedin'
        };

        var auth = new FirebasePassportLogin(store, function (err, user) {
            if (err) {
                Auth.USER = null;
                console.error('login error', err);
            } else if (user) {
                Auth.USER = user;
                console.info('user login', user);
            } else {
                Auth.USER = null;
                console.info('user logout');
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

        return Auth;
    }
]);
