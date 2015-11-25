angular.module('tcp').controller('SearchController', [
    '$scope',
    '$routeParams',
    'RecentSearches',
    'NavigationService',
    'ServicesService',
    'lodash',
    function ($scope, $routeParams, RecentSearches, NavigationService, ServicesService, lodash) {
        'use strict';

        var COMPANY = { _type: 'company' },
            USER = { _type: 'user' };

        $scope.query = '';
        $scope.results = {};
        $scope.searches = RecentSearches.get();

        /**
         * @param {String} str
         * @return {Query}
         */
        function buildQuery(str) {
            return {
                index: 'entity',
                query: str,
                size: 50
            };
        }

        /**
         * @param {Object} hits
         * @return {Object} empty: Boolean, company: Company[], user: User[]
         */
        function normalizeResults(hits) {
            return {
                empty: !hits.length,
                company: lodash.where(hits, COMPANY),
                user: lodash.where(hits, USER)
            };
        }

        /**
         * @param {String} query
         * @param {jQuery.Event} [ev]
         */
        $scope.search = function (query, ev) {
            if (ev) {
                query = ev.target.elements.q.value;
                ev.preventDefault();
            }

            $scope.loading = true;
            $scope.results = {};

            NavigationService.search(query);
            ServicesService.search.fuzzy(query).then(function (res) {
                $scope.loading = false;
                $scope.searches = RecentSearches.get();
                $scope.results = normalizeResults(res.data.hits.hits);

                if (!$scope.results.empty && !lodash.contains(RecentSearches.get(), query)) {
                    RecentSearches.unshift(query);
                }
            });
        };

        if (NavigationService.oneOf([NavigationService.BASES.SEARCH])) {
            $scope.query = $routeParams.q;
            $scope.$watch('query', function () {
                if ($scope.query) {
                    $scope.search($scope.query);
                }
            });
        }
    }
]);
