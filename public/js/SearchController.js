'use strict';

angular.module('tcp').controller('SearchController', ['$scope', function ($scope) {
    $scope.searching = false;

    $scope.search = function (text) {
        // TODO
        $scope.searching = true;
        console.log('searching for %s', text);
    };
}]);
