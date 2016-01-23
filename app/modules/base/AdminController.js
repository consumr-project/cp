angular.module('tcp').controller('AdminController', [
    '$scope',
    '$interval',
    'ServicesService',
    'SessionService',
    'utils',
    'Cookie',
    'lodash',
    function ($scope, $interval, ServicesService, SessionService, utils, Cookie, _) {
        'use strict';

        var SYNC_INTERVAL = 300000;

        // active session. cached in `client:session` cookie
        $scope.session = getSession();

        // actions menu under avatar in header
        $scope.actions = {
            show: null
        };

        // login popover settings
        $scope.login = {
            more: false,

            // from popover
            hide: null,
            show: null
        };

        $scope.withLinkedin = loginWithLinkedin;
        $scope.login = login;
        $scope.logout = logout;

        $scope.$watchCollection('session', cacheSession);
        SessionService.on(SessionService.EVENT.LOGIN, updateCurrentUser);
        SessionService.on(SessionService.EVENT.LOGIN, getMessages);
        SessionService.on(SessionService.EVENT.ERROR, clearSession);
        SessionService.on(SessionService.EVENT.LOGOUT, clearSession);
        SessionService.on(SessionService.EVENT.NOTIFY, getMessages);

        function loginWithLinkedin() {
            console.info('loggin in with linkedin');
            $scope.login.hide();
            SessionService.login(SessionService.PROVIDER.LINKEDIN);
        }

        function login() {
            $scope.login.show();
        }

        function logout() {
            console.info('logging out');
            SessionService.logout();
            $scope.actions.show = false;
        }

        /**
         * caches user information
         */
        function updateCurrentUser() {
            $scope.session.email = SessionService.USER.email;
            $scope.session.logged_in = true;
        }

        /**
         * @return {Promise}
         */
        function getMessages() {
            ServicesService.notification.get.cancel();
            return ServicesService.notification.get().then(function (items) {
                $scope.session.message_count = items.length;
            });
        }

        /**
         * @return {void}
         */
        function sync() {
            SessionService.refresh().then(function (user) {
                if (user && user.id) {
                    getMessages();
                }
            });
        }

        /**
         * resets session
         */
        function clearSession() {
            $scope.session = {};
        }

        /**
         * @param {Object} session (see $scope.session)
         */
        function cacheSession(session) {
            console.info('caching %o in session', Object.keys(session));
            return Cookie.set('client:session', session);
        }

        /**
         * @return {Object}
         */
        function getSession() {
            return Cookie.getJSON('client:session') || {};
        }

        sync();
        $interval(sync, SYNC_INTERVAL);
    }
]);
