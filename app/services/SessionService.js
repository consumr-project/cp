angular.module('tcp').service('SessionService', [
    'EventEmitter2',
    'ServicesService',
    'utils',
    '$document',
    '$http',
    function (EventEmitter2, ServicesService, utils, $document, $http) {
        'use strict';

        var events = {
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
            return ServicesService.auth.login(provider);
        }

        /**
         * @return {Promise}
         */
        function logout() {
            return ServicesService.auth.logout().then(refresh);
        }

        /**
         * fetches the current user and updates USER
         * @return {Promise}
         */
        function refresh() {
            return ServicesService.auth.user()
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

        return service;
    }
]);
