'use strict';

angular.module('tcp').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/search', {
        templateUrl: '/public/views/search.html',
        controller: 'SearchController'
    });

    $locationProvider.html5Mode(true);
}]);
