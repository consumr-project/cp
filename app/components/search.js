/**
 * @attribute {Boolean} form include a search form
 * @attribute {Boolean} redirect go to another page intead of fetch results
 */
angular.module('tcp').directive('search', [
    'ServicesService',
    'NavigationService',
    'lodash',
    function (ServicesService, NavigationService, lodash) {
        'use strict';

        /**
         * get a blank slate state
         * @return {Object}
         */
        function new_state() {
            return {
                loading: false,
                results: {
                    companies: [],
                    users: [],
                }
            };
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {Promise}
         */
        function search($scope) {
            $scope.vm.loading = true;
            return ServicesService.search.query($scope.query).then(function (results) {
                var groups = lodash.groupBy(results.body, 'type');
                $scope.vm.results.companies = $scope.vm.results.companies.concat(groups.company);
                $scope.vm.results.users = $scope.vm.results.users.concat(groups.user);
                $scope.vm.loading = false;
            });
        }

        /**
         * @param {Angular.Scope} $scope
         */
        function controller($scope) {
            if ($scope.query) {
                $scope.nav = NavigationService;
                $scope.vm = new_state();
                search($scope);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                form: '@',
                redirect: '@',
                query: '@'
            },
            template: [
                '<div class="search">',
                '    <form ng-if="form" action="{{redirect ? \'/search\' : \'\'}}">',
                '        <input prop="placeholder" i18n="admin/search_placeholder" ',
                '            name="q" tabindex="1" class="search__input" />',
                '    </form>',

                '    <div ng-if="query && form" class="margin-top-xlarge"></div>',

                '    <div ng-if="query" class="can-load" ng-class="{loading: vm.loading}">',
                '        <div class="search__result" ng-click="nav.company_by_id(company.id)" ',
                '            ng-repeat="company in vm.results.companies">',
                '            <h2>{{::company.name}}</h2>',
                '            <p>{{::company.summary || company.name}}</p>',
                '        </div>',

                '        <div class="search__result" ng-click="nav.user(user.id)" ',
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
