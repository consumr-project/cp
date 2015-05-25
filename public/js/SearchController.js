'use strict';

angular.module('tcp').controller('SearchController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.searching = false;

    $scope.search = function (text) {
        $scope.searching = true;

        // TODO
        $timeout(function () {
            $scope.searching = false;
        }, 3000);
    };
}]);
