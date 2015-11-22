angular.module('tcp').controller('AdminController', [
    '$scope',
    'Auth',
    'utils',
    'users',
    'Cookie',
    'lodash',
    function ($scope, Auth, utils, users, Cookie, _) {
        'use strict';

        var COOKIE_SESSION = 'client:session';

        $scope.session = Cookie.getJSON(COOKIE_SESSION) || {};

        $scope.actions = {
            show: null
        };

        $scope.login = {
            more: false,

            // from popover
            hide: null,
            show: null
        };

        $scope.withLinkedin = function () {
            $scope.login.hide();
            return Auth.login(Auth.PROVIDER.LINKEDIN);
        };

        $scope.login = function () {
            $scope.login.show();
        };

        $scope.logout = function () {
            Auth.logout();
            $scope.actions.show = false;
        };

        $scope.$watchCollection('session', _.curry(Cookie.set, 2)(COOKIE_SESSION));

        Auth.on(Auth.EVENT.LOGIN, function () {
            users.get(Auth.USER.uid).then(function (user) {
              _.extend(Auth.USER, user);
              $scope.session.userAvatarUrl = user.avatarUrl;
              $scope.session.loggedIn = true;
              $scope.$apply();
            });
        });

        Auth.on(Auth.EVENT.LOGOUT, function () {
            $scope.session = {};
        });
    }
]);
