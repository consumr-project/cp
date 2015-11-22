angular.module('tcp').controller('AdminController', [
    '$scope',
    'Auth',
    'utils',
    'users',
    'Cookie',
    'lodash',
    function ($scope, Auth, utils, users, Cookie, _) {
        'use strict';

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
        Auth.on(Auth.EVENT.LOGIN, fetchCurrentUser);
        Auth.on(Auth.EVENT.LOGOUT, clearSession);

        function loginWithLinkedin() {
            $scope.login.hide();
            return Auth.login(Auth.PROVIDER.LINKEDIN);
        }

        function login() {
            $scope.login.show();
        }

        function logout() {
            Auth.logout();
            $scope.actions.show = false;
        }

        /**
         * updates Auth.USER with additional information from store
         */
        function fetchCurrentUser() {
            return users.get(Auth.USER.uid).then(function (user) {
                _.extend(Auth.USER, user);
                $scope.session.userAvatarUrl = user.avatarUrl;
                $scope.session.loggedIn = true;
                $scope.$apply();
            });
        }

        function clearSession() {
            $scope.session = {};
        }

        /**
         * @param {Object} session (see $scope.session)
         */
        function cacheSession(session) {
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
