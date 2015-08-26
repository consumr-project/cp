angular.module('tcp').controller('adminController', [
    '$scope',
    'Auth',
    function ($scope, Auth) {
        'use strict';

        $scope.settings = {
            show: false,
            login: function () {
                $scope.settings.show = false;
                $scope.loginPopover.show();
            }
        };

        $scope.loginPopover = {
            // from popover api
            hide: null,
            show: null,

            showMoreOptions: false,
            linkedinLogin: function () {
                $scope.loginPopover.hide();
                return Auth.login(Auth.PROVIDER.LINKEDIN);
            }
        };
    }
]);
