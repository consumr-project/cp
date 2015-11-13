angular.module('tcp').controller('SearchController', [
    '$scope',
    '$routeParams',
    'RecentSearches',
    'NavigationService',
    'search',
    'lodash',
    function ($scope, $routeParams, RecentSearches, NavigationService, search, lodash) {
        'use strict';

        var COMPANY = { _type: 'company' },
            USER = { _type: 'user' };

        $scope.query = '';
        $scope.results = {};
        $scope.searches = RecentSearches.get();

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
            search.search('entity', '', query).then(function (res) {
                $scope.loading = false;
                $scope.searches = RecentSearches.get();
                $scope.results.empty = !res.hits.hits.length;
                $scope.results.company = lodash.where(res.hits.hits, COMPANY);
                $scope.results.user = lodash.where(res.hits.hits, USER);
                $scope.$apply();

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
