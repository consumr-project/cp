angular.module('tcp').controller('userController', [
    '$scope',
    '$routeParams',
    'userStore',
    'entity',
    'utils',
    function ($scope, $routeParams, userStore, entity, utils) {
        'use strict';

        $scope.user = {};

        entity.get(userStore, $routeParams.guid).then(function (ref) {
            $scope.user = ref.val();
            $scope.$apply();
        });

        $scope.$watch('user.summary', function (summary) {
            if (summary) {
                $scope.user.shortSummary = utils.summaryze(summary);
            }
        });
    }
]);
