angular.module('tcp').controller('adminController', [
    '$scope',
    'Auth',
    function ($scope, Auth) {
        'use strict';

        $scope.state = {
            loggedIn: false
        };

        $scope.loginPopover = {
            showLoginScreen: false,
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
            $scope.loginPopover.showLoginScreen = false;
            $scope.loginPopover.show();
        };

        $scope.logout = function () {
            $scope.loginPopover.showLoginScreen = false;
            Auth.logout();
        };

        Auth.on(Auth.EVENT.LOGIN, function () {
            $scope.state.loggedIn = true;
        });

        Auth.on(Auth.EVENT.LOGOUT, function () {
            $scope.state.loggedIn = false;
        });
    }
]);
