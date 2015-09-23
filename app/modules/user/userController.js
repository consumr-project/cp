angular.module('tcp').controller('userController', [
    '$scope',
    '$routeParams',
    'users',
    'utils',
    'i18n',
    function ($scope, $routeParams, users, utils, i18n) {
        'use strict';

        $scope.user = {};
        $scope.i18n = i18n;

        users.get($routeParams.guid).then(function (user) {
            $scope.user = user;
            $scope.$apply();
        });

        $scope.$watch('user.summary', function (summary) {
            if (summary) {
                $scope.user.shortSummary = utils.summaryze(summary);
            }
        });
    }
]);
