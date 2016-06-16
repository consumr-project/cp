import * as _ from 'lodash';
import * as moment from 'moment/moment';
import * as Cookie from 'js-cookie';
import { EventEmitter2 } from 'eventemitter2';
import * as utils from './services/Utilities';
import * as messages from './services/messages';
import { Cache, LocalStorageListCache } from 'jtils/dist/cache';
import * as jQuery from 'jquery';
import * as analytics from 'universal-analytics/index';

declare var i18n: any;

declare var TCP_BUILD_CONFIG: {
    features: any;
    analytics: { gaid: string; };
    environment: { name: string; };
    rollbar: { token: string; };
    locate: { dateFormat: string; };
};

namespace tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;
    const ERRORED: Boolean = (<any>window).ERRORED;

    var deps: Array<string> = ['ngSanitize', 'ngRoute', 'ngAria', 'ngAnimate', 'afkl.lazyImage'];
    var Visitor = !DEBUGGING ? analytics(TCP_BUILD_CONFIG.analytics.gaid) :
        analytics(TCP_BUILD_CONFIG.analytics.gaid).debug();

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
        .constant('RUNTIME', {
            locale: 'en-US',
        })
        .constant('DOMAIN', {
            model: {
                company: 'company',
                company_props: {
                    summary: 'summary',
                    wikipedia_url: 'wikipedia_url',
                    website_url: 'website_url',
                },

                user: 'user',
                tag: 'tag',

                event: 'event',
                event_props: {
                    sentiments: {
                        neutral: 'neutral',
                    },
                    type: {
                        company_created: 'company_created'
                    }
                },

                message: {
                    category: {
                        notification: 'NOTIFICATION',
                    },
                    subcategory: {
                        followed: 'FOLLOWED',
                    },
                },

                feedback_props: {
                    type: {
                        question: 'question',
                        suggestion: 'suggestion',
                        problem: 'problem',
                    }
                },
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
        .value('messages', messages)
        .value('moment', moment)
        .value('utils', utils)
        .value('Visitor', Visitor);

    angular.module('tcp').config([
        '$routeProvider',
        '$locationProvider',
        '$compileProvider',
        '$animateProvider',
        function ($routeProvider, $locationProvider, $compileProvider, $animateProvider) {
            $animateProvider.classNameFilter(/ng-animated/);
            $locationProvider.html5Mode(true);
            $compileProvider.debugInfoEnabled(DEBUGGING);

            let IdSetterController = ['$scope', '$routeParams', function ($scope, $routeParams) {
                $scope.id = $routeParams.id;
            }];

            let PropSetterController = (props: string[] = [], query: string[] = []) => ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
                props.map(prop => $scope[prop] = $routeParams[prop]);
                query.map(prop => $scope[prop] = $location.search()[prop]);
            }];

            let UserCheck = ['Session', Session =>
                Session.refresh()];

            let PageView = ['Visitor', Visitor =>
                Visitor.pageview(window.location.pathname + window.location.search).send()];

            if (DEBUGGING) {
                $routeProvider.when('/guide', {
                    resolve: { PageView },
                    templateUrl: '/assets/views/guide.html',
                });
            }

            $routeProvider.when('/', {
                resolve: { PageView },
                template:
                    '<div>' +
                    '    <div class="banner banner--1">' +
                    '        <div class="site-content">' +
                    '            <search form="true"></search>' +
                    '            <p class="copy--large header-spacing--top" i18n="common/intro"></p>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>'
            });

            $routeProvider.when('/search', {
                resolve: { PageView },
                reloadOnSearch: false,
                controller: PropSetterController([], ['q']),
                template:
                    '<div class="site-content">' +
                    '    <search query="{{q}}"></search>' +
                    '</div>'
            });

            $routeProvider.when('/user', {
                resolve: { PageView },
                redirectTo: '/user/me'
            });

            $routeProvider.when('/user/me/:category?/:subcategory?', {
                template: '<user class="site-content" id="{{id}}"></user>',
                resolve: { UserCheck, PageView },
                controller: ['$scope', 'Session', function ($scope, Session) {
                    $scope.id = Session.USER.id;
                }]
            });

            $routeProvider.when('/user/:id/:category?/:subcategory?', {
                resolve: { PageView },
                template: '<user class="site-content" id="{{id}}"></user>',
                controller: IdSetterController
            });

            $routeProvider.when('/tag/:id', {
                template: '<tag-view class="site-content" id="{{id}}"></tag-view>',
                controller: PropSetterController(['id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/company/id/:id', {
                template: '<company class="site-content" id="{{id}}"></company>',
                controller: PropSetterController(['id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/company/:guid?', {
                template: '<company class="site-content" guid="{{guid}}" create="{{create}}"></company>',
                controller: PropSetterController(['guid'], ['create']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/noop', {
                template: ''
            });

            $routeProvider.otherwise({
                resolve: { PageView },
                controller: ['$scope', 'ERRORED', function ($scope, ERRORED) { $scope.ERRORED = ERRORED; }],
                template:
                    '<div class="site-content">' +
                        '<message ng-if="!ERRORED" type="error" i18n="common/not_found"></message>' +
                        '<message ng-if="ERRORED" type="error" i18n="common/error_loading"></message>' +
                    '</div>'
            });
        }
    ]);

    angular.module('tcp').run([
        '$route',
        '$rootScope',
        '$location',
        function ($route, $rootScope, $location) {
            var original = $location.path;
            $location.path = function (path, reload) {
                if (reload === false) {
                    var lastRoute = $route.current;
                    var same = path === $location.path();

                    var un = $rootScope.$on('$locationChangeSuccess', function () {
                        // issue when doing reload = false on same page
                        // preventing next routes from working
                        if (!same) {
                            $route.current = lastRoute;
                        }

                        un();
                    });
                }
                return original.apply($location, [path]);
            };
        }
    ]);
}
