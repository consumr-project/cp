'use strict';

angular.module('tcp').config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/search', {
        templateUrl: '/public/views/search.html',
        controller: 'SearchController'
    });

    $locationProvider.html5Mode(true);
});
