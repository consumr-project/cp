angular.module('tcp').controller('AdminController', [
    '$scope',
    'Auth',
    'utils',
    'users',
    'lodash',
    function ($scope, Auth, utils, users, _) {
        'use strict';

        $scope.session = {
            loggedIn: false
        };

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

        Auth.on(Auth.EVENT.LOGIN, function () {
            users.get(Auth.USER.uid).then(function (user) {
              _.extend(Auth.USER, user);
              $scope.session.userAvatarUrl = user.avatarUrl;
              $scope.session.loggedIn = true;
              $scope.$apply();
            });
        });

        Auth.on(Auth.EVENT.LOGOUT, function () {
            $scope.session.loggedIn = false;
        });
    }
]);
