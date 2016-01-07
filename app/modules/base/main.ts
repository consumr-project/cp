/// <reference path="./typings.d.ts"/>

import * as _ from 'lodash';
import * as moment from 'moment';
import * as Cookie from 'js-cookie';
import {EventEmitter2} from 'eventemitter2';
import * as utils from './utils';
import {Cache, LocalStorageListCache} from 'jtils/dist/cache';

import * as jQuery from 'jquery';
require('bootstrap-datepicker');

module tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;

    var deps: Array<string> = ['ngRoute', 'ngAria'];

    if (DEBUGGING) {
        deps.push('rector');
    }

    moment.locale(navigator.userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('DEBUGGING', DEBUGGING)
        .constant('CONFIG', TCP_BUILD_CONFIG);

    angular.module('tcp')
        .value('Cache', Cache)
        .value('Cookie', Cookie)
        .value('EventEmitter2', EventEmitter2)
        .value('RecentSearches', new LocalStorageListCache('tcp:searches', 5))
        .value('i18n', i18n) // global
        .value('jQuery', jQuery)
        .value('lodash', _)
        .value('moment', moment)
        .value('utils', utils);

    angular.module('tcp').config([
        '$routeProvider',
        '$locationProvider',
        '$compileProvider',
        function ($routeProvider, $locationProvider, $compileProvider) {
            $locationProvider.html5Mode(true);
            $compileProvider.debugInfoEnabled(DEBUGGING);

            let IdSetterController = ['$scope', '$routeParams', function ($scope, $routeParams) {
                $scope.id = $routeParams.id;
            }];

            let PropSetterController = (props: string[] = [], query: string[] = []) => ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
                props.map(prop => $scope[prop] = $routeParams[prop]);
                query.map(prop => $scope[prop] = $location.search()[prop]);
            }];

            let UserCheck = {
                current_user: ['SessionService', function (SessionService) {
                    SessionService.refresh();
                }]
            };

            if (DEBUGGING) {
                $routeProvider.when('/guide', {
                    templateUrl: '/app/modules/guide/index.html',
                    controller: 'GuideController'
                });
            }

            $routeProvider.when('/', {
                templateUrl: '/app/modules/home/index.html'
            });

            $routeProvider.when('/search', {
                templateUrl: '/app/modules/search/index.html',
                controller: 'SearchController'
            });

            $routeProvider.when('/user/:id', {
                template: '<user class="site-content" id="{{id}}"></user>',
                controller: IdSetterController
            });

            $routeProvider.when('/company/:guid?', {
                template: '<company class="site-content" guid="{{guid}}" create="{{create}}"></company>',
                controller: PropSetterController(['guid'], ['create']),
                resolve: UserCheck
            });

            $routeProvider.otherwise({
                template:
                    '<div class="site-content">' +
                        '<message type="error" i18n="common/not_found"></message>' +
                    '</div>'
            });
        }
    ]);
}
