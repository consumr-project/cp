'use strict';

angular.module('tcp').controller('searchController', ['$scope', '$routeParams', '$timeout', function ($scope, $routeParams, $timeout) {
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

    // cleared search field -> go back to full search view
    $scope.$watch('searchText', function (val) {
        if (!val) {
            $scope.listResults = false;
            $scope.searching = false;
        }
    });

    // loading url with q parameter
    if ($routeParams.q) {
        $scope.searchText = $routeParams.q;
        $scope.search($scope.searchText);
    }
}]);
