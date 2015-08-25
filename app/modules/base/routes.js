angular.module('tcp').config([
    '$routeProvider',
    '$locationProvider',
    'DEBUGGING',
    function ($routeProvider, $locationProvider, DEBUGGING) {
        'use strict';

        if (DEBUGGING) {
            $routeProvider.when('/guide', {
                templateUrl: '/app/modules/dev/index.html',
                controller: 'guideController'
            });
        }

        $routeProvider.when('/', {
            templateUrl: '/app/modules/home/index.html',
            controller: 'homeController'
        });

        $routeProvider.when('/user/:guid', {
            templateUrl: '/app/modules/user/index.html',
            controller: 'userController'
        });

        $routeProvider.when('/company/:guid?', {
            templateUrl: '/app/modules/company/index.html',
            controller: 'companyController'
        });

        $routeProvider.when('/company/:companyGuid/entry/:guid?', {
            templateUrl: '/app/modules/entry/index.html',
            controller: 'entryController'
        });

        $routeProvider.otherwise({
            templateUrl: '/app/modules/base/404.html',
        });

        $locationProvider.html5Mode(true);
    }
]);
