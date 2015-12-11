/// <reference path="../../typings.d.ts"/>

import * as _ from 'lodash';
import * as moment from 'moment';
import * as Cookie from 'js-cookie';
import {EventEmitter2} from 'eventemitter2';
import * as utils from '../../services/utils';
import * as wikipedia from '../../services/wikipedia';
import logger from '../../services/logger';
import {Cache, LocalStorageListCache} from 'jtils/dist/cache';

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
        .value('lodash', _)
        .value('logger', logger)
        .value('moment', moment)
        .value('utils', utils)
        .value('wikipedia', wikipedia);

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

            $routeProvider.when('/user/:id', {
                templateUrl: '/app/modules/user/index.html',
                controller: 'UserController'
            });

            $routeProvider.when('/company/:id?', {
                templateUrl: '/app/modules/company/index.html',
                controller: 'CompanyController'
            });

            $routeProvider.otherwise({
                templateUrl: '/app/modules/base/404.html',
            });
        }
    ]);
}
