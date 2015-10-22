angular.module('tcp').controller('adminController', [
    '$scope',
    'Auth',
    'utils',
    function ($scope, Auth, utils) {
        'use strict';

        $scope.state = {
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

        // $scope.profile = function () {
        //     utils.href('user', Auth.USER.uid);
        // };

        Auth.on(Auth.EVENT.LOGIN, function () {
            $scope.state.loggedIn = true;
        });

        Auth.on(Auth.EVENT.LOGOUT, function () {
            $scope.state.loggedIn = false;
        });
    }
]);
