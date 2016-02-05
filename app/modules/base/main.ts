import * as _ from 'lodash';
import * as moment from 'moment';
import * as Cookie from 'js-cookie';
import {EventEmitter2} from 'eventemitter2';
import * as utils from './utils';
import {Cache, LocalStorageListCache} from 'jtils/dist/cache';
import * as jQuery from 'jquery';

module tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;
    const ERRORED: Boolean = (<any>window).ERRORED;

    var deps: Array<string> = ['ngRoute', 'ngAria'];

    if (DEBUGGING) {
        deps.push('rector');
    }

    moment.locale(navigator.userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('CONFIG', TCP_BUILD_CONFIG)
        .constant('DEBUGGING', DEBUGGING)
        .constant('ERRORED', ERRORED);

    angular.module('tcp')
        .constant('Domain', {
            model: {
                company: 'company',
                event: 'event',
                company_props: {
                    summary: 'summary',
                    wikipedia_url: 'wikipedia_url',
                    website_url: 'website_url',
                }
            }
        });

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
                    return SessionService.refresh();
                }]
            };

            if (DEBUGGING) {
                $routeProvider.when('/guide', {
                    templateUrl: '/app/modules/guide/index.html',
                    controller: 'GuideController'
                });
            }

            $routeProvider.when('/', {
                template:
                    '<div class="site-content">' +
                    '    <search form="true" redirect="true"></search>' +
                    '    <p class="copy--large header-spacing--top" i18n="common/intro"></p>' +
                    '</div>'
            });

            $routeProvider.when('/search', {
                controller: PropSetterController([], ['q']),
                template:
                    '<div class="site-content">' +
                    '    <search form="true" query="{{q}}"></search>' +
                    '</div>'
            });

            $routeProvider.when('/user', {
                redirectTo: '/user/me'
            });

            $routeProvider.when('/user/me', {
                template: '<user class="site-content" id="{{id}}"></user>',
                resolve: UserCheck,
                controller: ['$scope', 'SessionService', function ($scope, SessionService) {
                    $scope.id = SessionService.USER.id;
                }]
            });

            $routeProvider.when('/user/notifications', {
                template: '<notifications class="site-content"></notifications>',
                resolve: UserCheck
            });

            $routeProvider.when('/user/:id', {
                template: '<user class="site-content" id="{{id}}"></user>',
                controller: IdSetterController
            });

            $routeProvider.when('/company/id/:id', {
                template: '<company class="site-content" id="{{id}}"></company>',
                controller: PropSetterController(['id']),
                resolve: UserCheck
            });

            $routeProvider.when('/company/:guid?', {
                template: '<company class="site-content" guid="{{guid}}" create="{{create}}"></company>',
                controller: PropSetterController(['guid'], ['create']),
                resolve: UserCheck
            });

            $routeProvider.otherwise({
                controller: ['$scope', 'ERRORED', function ($scope, ERRORED) { $scope.ERRORED = ERRORED; }],
                template:
                    '<div class="site-content">' +
                        '<message ng-if="!ERRORED" type="error" i18n="common/not_found"></message>' +
                        '<message ng-if="ERRORED" type="error" i18n="common/error_loading"></message>' +
                    '</div>'
            });
        }
    ]);
}
