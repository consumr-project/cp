angular.module('tcp').controller('searchController', [
    '$scope',
    '$routeParams',
    'LocalStorageListCache',
    'NavigationService',
    'search',
    'lodash',
    function ($scope, $routeParams, LocalStorageListCache, NavigationService, search, lodash) {
        'use strict';

        var COMPANY = { _type: 'company' },
            USER = { _type: 'user' };

        var searches = new LocalStorageListCache('tcp:searches', 5);

        $scope.query = '';
        $scope.results = {};
        $scope.searches = searches.get();

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
                $scope.searches = searches.get();
                $scope.results.empty = !res.hits.hits.length;
                $scope.results.company = lodash.where(res.hits.hits, COMPANY);
                $scope.results.user = lodash.where(res.hits.hits, USER);
                $scope.$apply();

                if (!$scope.results.empty && !lodash.contains(searches.get(), query)) {
                    searches.unshift(query);
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
