/// <reference path="../../typings.d.ts"/>

import * as _ from 'lodash';
import * as moment from 'moment';
import * as utils from '../../services/utils';
import * as wikipedia from '../../services/wikipedia';
import * as entity from '../../services/entity';
import * as keyword from '../../services/keyword';
import logger from '../../services/logger';
import Search from '../../services/search';
import {Cache, LocalStorageListCache} from 'jtils/dist/cache';
import {Session, session as startSession} from '../../services/auth';

// TODO remove once AdminController imports new auth service
import {EVENT as AuthEvent, PROVIDER as AuthProvider} from '../../services/auth';

module tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;

    var store: Firebase = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        session: Session = startSession('/service/auth/', store),
        deps: Array<string> = ['ngRoute', 'ngAria'];

    if (DEBUGGING) {
        deps.push('rector');
    }

    moment.locale(navigator.userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('DEBUGGING', DEBUGGING)
        .constant('CONFIG', TCP_BUILD_CONFIG);

    // TODO remove once AdminController imports new auth service
    (<any>session).EVENT = AuthEvent;
    (<any>session).PROVIDER = AuthProvider;

    angular.module('tcp')
        .value('Auth', session)
        .value('Cache', Cache)
        .value('RecentSearches', new LocalStorageListCache('tcp:searches', 5))
        .value('companies', entity.bind('company', store))
        .value('companyEvents', entity.bind('company-events', store))
        .value('entity', entity)
        .value('events', entity.bind('event', store))
        .value('i18n', i18n) // global
        .value('lodash', _)
        .value('logger', logger)
        .value('moment', moment)
        .value('search', new Search(store.child('search')))
        .value('store', store)
        .value('keyword', keyword)
        .value('users', entity.bind('user', store))
        .value('utils', utils)
        .value('wikipedia', wikipedia);

    // values from route resolve
    angular.module('tcp')
        .value('show_add_event', false);

    angular.module('tcp').config([
        '$routeProvider',
        '$locationProvider',
        '$compileProvider',
        function ($routeProvider, $locationProvider, $compileProvider) {
            $locationProvider.html5Mode(true);
            $compileProvider.debugInfoEnabled(DEBUGGING);

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

            $routeProvider.when('/user/:guid', {
                templateUrl: '/app/modules/user/index.html',
                controller: 'UserController'
            });

            $routeProvider.when('/company/:guid?', {
                templateUrl: '/app/modules/company/index.html',
                controller: 'CompanyController',
                resolve: {
                    show_add_event: () => false
                }
            });

            $routeProvider.when('/company/:guid/event/:eventGuid?', {
                templateUrl: '/app/modules/company/index.html',
                controller: 'CompanyController',
                resolve: {
                    show_add_event: () => true
                }
            });

            $routeProvider.otherwise({
                templateUrl: '/app/modules/base/404.html',
            });
        }
    ]);
}
