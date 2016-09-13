/**
 * @attribute {Boolean} redirects to the search page
 * @attribute {String} query search
 */
angular.module('tcp').directive('search', [
    'DOMAIN',
    'Services',
    'Navigation',
    'RecentSearches',
    'lodash',
    function (DOMAIN, Services, Navigation, RecentSearches, lodash) {
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
                    tags: [],
                }
            };
        }

        /**
         * @param {String} query
         * @param {ServiceResponseV1} results
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

            return Services.search.query(query).then(function (results) {
                var groups = lodash.groupBy(results.body, 'type'),
                    result = lodash.head(results.body);

                $scope.vm.results.companies = groups.company;
                $scope.vm.results.users = groups.user;
                $scope.vm.results.tags = groups.tag;

                $scope.vm.empty = !results.body || !results.body.length;
                $scope.vm.loading = false;
                $scope.vm.recent = track_search(query, results);
            });
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.nav = Navigation;
            $scope.vm = new_state();

            $scope.search_placeholder = Navigation.one_of([
                Navigation.BASES.HOME,
                Navigation.BASES.SEARCH,
            ]) ? 'admin/search_long_placeholder' : 'admin/search_placeholder';

            $scope.search = function (query, $event) {
                Navigation.search(query, $event);
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
                redirects: '@',
                query: '@'
            },
            template: [
                '<div class="search">',
                '    <form ng-submit="search(query, $event)">',
                '        <input prop="placeholder" i18n="{{::search_placeholder}}" ',
                '            name="q" tabindex="1" class="search__input" ',
                '            ng-change="search(query, $event)"',
                '            ng-focus="!redirects" ng-model="query" />',
                '    </form>',

                '    <div ng-if="query && !redirects" class="can-load margin-top-xlarge" ng-class="{loading: vm.loading}">',
                '        <div ng-if="!vm.loading && vm.empty" class="center-align animated fadeIn">',
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
                '                <a ng-click="search(recent_search)">{{recent_search}}</a>',
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

                '        <tags>',
                '            <tag class="keyword animated fadeIn" ng-click="nav.tag(tag.id)" ',
                '                label="{{::tag.name}}"',
                '                ng-repeat="tag in vm.results.tags"></tag>',
                '        </tags>',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
