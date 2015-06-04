angular.module('tcp').config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {
        'use strict';

        $routeProvider.when('/search', {
            templateUrl: '/app/modules/search/search.html',
            controller: 'searchController'
        });

        $routeProvider.when('/add-company', {
            templateUrl: '/app/modules/company/company.html',
            controller: 'companyController'
        });

        $routeProvider.when('/add-post', {
            templateUrl: '/app/modules/post/post.html',
            controller: 'postController'
        });

        $locationProvider.html5Mode(true);
    }
]);
