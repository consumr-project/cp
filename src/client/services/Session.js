angular.module('tcp').service('Session', [
    'EventEmitter2',
    'Services',
    '$document',
    function (EventEmitter2, Services, $document) {
        'use strict';

        var events = {
            NOTIFY: 'notify',
            LOCKED_DOWN: 'locked_down',
            LOGIN: 'login',
            LOGOUT: 'logout',
            ERROR: 'error'
        };

        var providers = {
            LINKEDIN: 'linkedin'
        };

        var service = new EventEmitter2();

        /**
         * @param {String} name
         * @return {Function(*)}
         */
        function emit(name) {
            return function (val) {
                service.emit(name);
                return val;
            };
        }

        /**
         * @param {String} provider
         * @return {Window}
         */
        function login(provider) {
            return Services.auth.login(provider);
        }

        /**
         * @return {Promise}
         */
        function logout() {
            return Services.auth.logout().then(refresh);
        }

        /**
         * fetches the current user and updates USER
         * @return {Promise}
         */
        function refresh() {
            return Services.auth.user()
                .then(set_user)
                .catch(emit(events.ERROR));
        }

        /**
         * @param {User} user
         * @return {User}
         */
        function set_user(user) {
            service.USER = user || {};
            service.emit(user && user.id ? events.LOGIN : events.LOGOUT);
            return user;
        }

        service.USER = {};
        service.EVENT = events;
        service.PROVIDER = providers;

        service.login = login;
        service.logout = logout;
        service.refresh = refresh;
        service.set_user = set_user;

        $document.on('cp:auth', refresh);
        $document.on('cp:auth_locked_down', emit(events.LOCKED_DOWN));

        return service;
    }
]);
