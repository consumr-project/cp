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
                .then(function (user) {
                    service.USER = user || {};
                    service.emit(user && user.id ? events.LOGIN : events.LOGOUT);
                    return user;
                })
                .catch(emit(events.ERROR));
        }

        service.USER = {};
        service.EVENT = events;
        service.PROVIDER = providers;
        service.login = login;
        service.logout = logout;
        service.refresh = refresh;

        $document.on('cp:auth', refresh);
        window.SessionService=service;
        return service;
    }
]);
