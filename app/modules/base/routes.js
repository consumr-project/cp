'use strict';

angular.module('tcp').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/search', {
        templateUrl: '/app/modules/search/search.html',
        controller: 'searchController'
    });

    $locationProvider.html5Mode(true);
}]);
