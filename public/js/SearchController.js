'use strict';

angular.module('tcp').controller('SearchController', ['$scope', function ($scope) {
    $scope.search = function (text) {
        // TODO
        console.log('searching for %s', text);
    };
}]);
