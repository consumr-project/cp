import * as _ from 'lodash';
import * as slug from 'slug';
import * as moment from 'moment/moment';
import * as Cookie from 'js-cookie';
import { EventEmitter2 } from 'eventemitter2';
import * as utils from './services/Utilities';
import * as messages from './services/messages';
import * as utils2 from '../utilities';
import * as EVENTS from '../events';
import { validator } from '../validate';
import * as validate from '../validate';
import { Cache, LocalStorageListCache } from 'jtils/dist/cache';
import * as jQuery from 'jquery';
import * as analytics from 'universal-analytics/index';
import * as assert from 'assert';

import shasum = require('shasum');

declare var i18n: {
    get(key: string, data?: Object): string;
};

declare var TCP_BUILD_CONFIG: {
    features: {
        [key: string]: {
            enabled: boolean;
        };
    }

    beta: {
        lockdown: boolean;
    };

    google: {
        analytics: {
            gaid: string;
        };

        recaptcha: {
            key: string;
        };
    };

    environment: {
        name: string;
    };

    rollbar: {
        token: string;
    };

    locate: {
        dateFormat: string;
    };
};

namespace tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;
    const ERRORED: Boolean = (<any>window).ERRORED;

    var deps: Array<string> = ['ngSanitize', 'ngRoute', 'ngAria', 'ngAnimate', 'afkl.lazyImage'];
    var Visitor = analytics(TCP_BUILD_CONFIG.google.analytics.gaid);

    if (DEBUGGING) {
        Visitor = Visitor.debug();
        deps.push('rector');
    }

    moment.locale((<any>navigator).userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('CONFIG', TCP_BUILD_CONFIG)
        .constant('DEBUGGING', DEBUGGING)
        .constant('ERRORED', ERRORED);

    angular.module('tcp')
        .constant('EVENTS', EVENTS)
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
                user_props: {
                    roles: {
                        admin: 'admin'
                    }
                },

                event: 'event',
                event_props: {
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
        .value('Dropzone', require('dropzone'))
        .value('EventEmitter2', EventEmitter2)
        .value('RecentSearches', new LocalStorageListCache('tcp:searches', 5))
        .value('Visitor', Visitor)
        .value('Webcam', require('webcamjs'))
        .value('assert', assert)
        .value('i18n', i18n) // global
        .value('jQuery', jQuery)
        .value('lodash', _)
        .value('messages', messages)
        .value('moment', moment)
        .value('shasum', shasum)
        .value('slug', slug)
        .value('utils', utils)
        .value('utils2', utils2)
        .value('validate', validate)
        .value('validator', validator);

    angular.module('tcp').config([
        '$routeProvider',
        '$locationProvider',
        '$compileProvider',
        '$animateProvider',
        function ($routeProvider, $locationProvider, $compileProvider, $animateProvider) {
            var page_counter = 0;

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

            let UserCheck = ['Session', Session => {
                if (!page_counter++) {
                    return Session.refresh();
                } else {
                    return Session.background_refresh();
                }
            }];

            let PageView = ['Visitor', Visitor =>
                Visitor.pageview(window.location.pathname + window.location.search).send()];

            if (DEBUGGING) {
                $routeProvider.when('/guide', {
                    resolve: { PageView },
                    templateUrl: '/assets/views/guide.html',
                });
            }

            $routeProvider.when('/', {
                resolve: { UserCheck, PageView },
                template: '<home-view></home-view>',
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

            $routeProvider.when('/tag/id/:id', {
                template: '<tag-view class="site-content" id="{{id}}"></tag-view>',
                controller: PropSetterController(['id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/tag/id/:id/event/:event_id', {
                template: '<tag-view class="site-content" id="{{id}}" event-id="{{event_id}}"></tag-view>',
                controller: PropSetterController(['id', 'event_id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/company/id/:id', {
                template: '<company class="site-content" id="{{id}}"></company>',
                controller: PropSetterController(['id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/company/id/:id/edit', {
                template: '<company view="edit" class="site-content" id="{{id}}"></company>',
                controller: PropSetterController(['id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/company/id/:id/event/:event_id', {
                template: '<company class="site-content" id="{{id}}" event-id="{{event_id}}"></company>',
                controller: PropSetterController(['id', 'event_id']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/company/:guid?', {
                template: '<company class="site-content" guid="{{guid}}" create="{{create}}"></company>',
                controller: PropSetterController(['guid'], ['create']),
                resolve: { UserCheck, PageView }
            });

            $routeProvider.when('/thx', {
                template: '<missing-data class="block site-content site-content--wide"></missing-data>',
                resolve: { UserCheck },
            });

            $routeProvider.when('/admin', {
                template: '<error-view ng-if="!allowed"></error-view>' +
                    '<admin-view ng-if="allowed" class="block site-content"></admin-view>',
                resolve: { UserCheck },
                controller: ['DOMAIN', 'Session', '$scope', (DOMAIN, Session, $scope) => {
                    $scope.allowed = Session.USER.role === DOMAIN.model.user_props.roles.admin;
                }],
            });

            $routeProvider.when('/noop', {
                template: ''
            });

            $routeProvider.otherwise({
                resolve: { PageView },
                template: '<error-view></error-view>',
            });
        }
    ]);

    angular.module('tcp').run([
        'Dropzone',
        'Webcam',
        'lodash',
        'slug',
        function (Dropzone, Webcam, lodash, slug) {
            Webcam.on('error', lodash.noop);
            Webcam.setSWFLocation('/node_modules/webcamjs/webcam.swf');
            Dropzone.autoDiscover = false;
            slug.defaults.mode = 'rfc3986';
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
