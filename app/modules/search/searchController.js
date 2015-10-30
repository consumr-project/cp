angular.module('tcp').controller('searchController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    'search',
    'lodash',
    function ($scope, $routeParams, NavigationService, search, lodash) {
        'use strict';

        var COMPANY = { _type: 'company' },
            USER = { _type: 'user' };

        $scope.query = '';
        $scope.results = {};

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
                $scope.results.company = lodash.where(res.hits.hits, COMPANY);
                $scope.results.user = lodash.where(res.hits.hits, USER);
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
