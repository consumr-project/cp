angular.module('tcp').controller('adminController', [
    '$scope',
    'Auth',
    function ($scope, Auth) {
        'use strict';

        $scope.loginPopover = {
            showMoreOptions: false,
            linkedinLogin: function () {
                $scope.loginPopover.hide();
                return Auth.login('linkedin');
            }
        };
    }
]);
