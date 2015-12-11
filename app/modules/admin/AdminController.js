angular.module('tcp').controller('AdminController', [
    '$scope',
    'SessionService',
    'utils',
    'users',
    'logger',
    'Cookie',
    'lodash',
    function ($scope, SessionService, utils, users, logger, Cookie, _) {
        'use strict';

        var log = logger('admin');

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
        SessionService.on(SessionService.EVENT.ERROR, clearSession);
        SessionService.on(SessionService.EVENT.LOGOUT, clearSession);

        function loginWithLinkedin() {
            log('loggin in with linkedin');
            $scope.login.hide();
            SessionService.login(SessionService.PROVIDER.LINKEDIN);
        }

        function login() {
            $scope.login.show();
        }

        function logout() {
            log('logging out');
            SessionService.logout();
            $scope.actions.show = false;
        }

        /**
         * caches user information
         */
        function updateCurrentUser() {
            $scope.session.avatar_url = SessionService.USER.avatar_url;
            $scope.session.logged_in = true;
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
            log('caching %o', Object.keys(session));
            return Cookie.set('client:session', session);
        }

        /**
         * @return {Object}
         */
        function getSession() {
            return Cookie.getJSON('client:session') || {};
        }
    }
]);
