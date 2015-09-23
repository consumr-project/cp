/// <reference path="../../../typings/i18n.d.ts"/>
/// <reference path="../../../typings/tcp.d.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

import * as _ from 'lodash';
import * as moment from 'moment';
import * as d3 from 'd3';
import * as utils from '../../services/utils';
import * as wikipedia from '../../services/wikipedia';
import * as entity from '../../services/entity';
import * as extract from '../../services/extract';
import * as highlighter from '../../services/highlighter';
import logger from '../../services/logger';
import {Session, session as startSession} from '../../services/auth';

// TODO remove once adminController imports new auth service
import {EVENT as AuthEvent, PROVIDER as AuthProvider} from '../../services/auth';

module tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;

    var store: Firebase = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        session: Session = startSession('/auth/', store, DEBUGGING),
        deps: Array<string> = ['ngRoute', 'ngAria'];

    if (DEBUGGING) {
        deps.push('rector');
    }

    moment.locale(navigator.userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('DEBUGGING', DEBUGGING)
        .constant('CONFIG', TCP_BUILD_CONFIG);

    // TODO remove once adminController imports new auth service
    (<any>session).EVENT = AuthEvent;
    (<any>session).PROVIDER = AuthProvider;

    angular.module('tcp')
        .value('Auth', session)
        .value('companyStore', store.child('company'))
        .value('d3', d3)
        .value('entity', entity)
        .value('extract', extract)
        .value('highlighter', highlighter)
        .value('i18n', i18n) // global
        .value('lodash', _)
        .value('logger', logger(DEBUGGING))
        .value('moment', moment)
        .value('store', store)
        .value('userStore', store.child('user'))
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
        }
    ]);
}
