angular.module('tcp').controller('searchController', [
    '$scope',
    '$routeParams',
    '$timeout',
    function ($scope, $routeParams, $timeout) {
        'use strict';

        $scope.listResults = false;
        $scope.searching = false;

        $scope.search = function (text) {
            $scope.listResults = true;
            $scope.searching = true;

            // TODO
            $timeout(function () {
                $scope.searching = false;
            }, 3000);
        };

        // loading url with q parameter
        if ($routeParams.q) {
            $scope.searchText = $routeParams.q;
            $scope.search($scope.searchText);
        }
    }
]);
