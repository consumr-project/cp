angular.module('tcp').controller('adminController', [
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

        $scope.loginPopover = {
            showMoreOptions: false,

            // from popover api
            hide: null,
            show: null
        };

        $scope.linkedinLogin = function () {
            $scope.loginPopover.hide();
            return Auth.login(Auth.PROVIDER.LINKEDIN);
        };

        $scope.login = function () {
            $scope.loginPopover.show();
        };

        // $scope.logout = function () {
        //     Auth.logout();
        // };

        $scope.profile = function () {
            utils.href('user', Auth.USER.uid);
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
