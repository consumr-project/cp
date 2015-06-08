angular.module('tcp').config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {
        'use strict';

        $routeProvider.when('/', {
            templateUrl: '/app/modules/search/search.html',
            controller: 'searchController'
        });

        $routeProvider.when('/search', {
            templateUrl: '/app/modules/search/search.html',
            controller: 'searchController'
        });

        $routeProvider.when('/company/:guid?', {
            templateUrl: '/app/modules/company/company.html',
            controller: 'companyController'
        });

        $routeProvider.when('/company/:guid/post/:id?', {
            templateUrl: '/app/modules/post/post.html',
            controller: 'postController'
        });

        $routeProvider.otherwise({
            templateUrl: '/app/modules/base/404.html',
        });

        $locationProvider.html5Mode(true);
    }
]);
