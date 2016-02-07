/**
 * @attribute {Boolean} form include a search form
 * @attribute {String} query search
 */
angular.module('tcp').directive('search', [
    'ServicesService',
    'NavigationService',
    'RecentSearches',
    'lodash',
    function (ServicesService, NavigationService, RecentSearches, lodash) {
        'use strict';

        /**
         * get a blank slate state
         * @return {Object}
         */
        function new_state() {
            return {
                empty: false,
                loading: false,
                recent: [],
                results: {
                    companies: [],
                    users: [],
                }
            };
        }

        /**
         * @param {String} query
         * @param {CPServiceResponseV1} results
         * @return {String[]}
         */
        function track_search(query, results) {
            if (results.meta.total && !lodash.includes(RecentSearches.get(), query)) {
                RecentSearches.unshift(query);
            }

            return RecentSearches.get();
        }

        /**
         * @param {String} query
         * @param {Angular.Scope} $scope
         * @return {Promise}
         */
        function search(query, $scope) {
            $scope.query = query;
            $scope.vm.loading = true;

            return ServicesService.search.query(query).then(function (results) {
                var groups = lodash.groupBy(results.body, 'type');

                $scope.vm.results.companies = groups.company;
                $scope.vm.results.users = groups.user;
                $scope.vm.empty = !results.meta.total;
                $scope.vm.loading = false;
                $scope.vm.recent = track_search(query, results);
            });
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.nav = NavigationService;
            $scope.vm = new_state();

            $scope.search = function (query) {
                search(query, $scope);
            };

            if ($scope.query) {
                $scope.search($scope.query);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                form: '@',
                query: '@'
            },
            template: [
                '<div class="search">',
                '    <form ng-if="form" ng-submit="nav.search(query, $event)">',
                '        <input prop="placeholder" i18n="admin/search_placeholder" ',
                '            name="q" tabindex="1" class="search__input" ',
                '            ng-model="query" />',
                '    </form>',

                '    <form ng-if="!form" ng-submit="nav.search(query, $event); search(query)">',
                '        <input prop="placeholder" i18n="admin/search_placeholder" ',
                '            name="q" tabindex="1" class="search__input" ',
                '            ng-focus="true" ng-model="query" />',
                '    </form>',

                '    <div ng-if="query" class="can-load margin-top-xlarge" ng-class="{loading: vm.loading}">',
                '        <div ng-show="!vm.loading && vm.empty" class="center-align animated fadeIn">',
                '            <h2 i18n="common/no_results" data="{query: query}"></h2>',

                '            <a ng-href="/company?create={{query}}">',
                '                <h3 i18n="common/create_this" data="{name: query}"></h3>',
                '            </a>',

                '            <h4 ng-if="vm.recent.length" i18n="common/recent_searches"',
                '                class="margin-top-xlarge margin-bottom-medium"></h4>',

                '            <div ng-repeat="recent_search in vm.recent"',
                '                class="margin-bottom-xsmall animated fadeInUp"',
                '                style="animation-delay: .{{::$index}}s"',
                '            >',
                '                <a ng-click="nav.search(recent_search); search(recent_search)">{{recent_search}}</a>',
                '            </div>',
                '        </div>',

                '        <div class="search__result animated fadeIn" ng-click="nav.company_by_id(company.id)" ',
                '            ng-repeat="company in vm.results.companies">',
                '            <h2>{{::company.name}}</h2>',
                '            <p>{{::company.summary || company.name}}</p>',
                '        </div>',

                '        <div class="search__result animated fadeIn" ng-click="nav.user(user.id)" ',
                '            ng-repeat="user in vm.results.users">',
                '            <h2>{{::user.name}}</h2>',
                '            <p>{{::user.summary || user.name}}</p>',
                '        </div>',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
