angular.module('tcp').controller('searchController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    function ($scope, $routeParams, NavigationService) {
        'use strict';

        $scope.query = $routeParams.q;

        /**
         * @param {String} query
         * @param {jQuery.Event} [ev]
         */
        $scope.search = function (query, ev) {
            if (!query && ev && ev.target && ev.target.elements && ev.target.elements.q) {
                query = ev.target.elements.q.value;
            }

            NavigationService.search(query);

            if (ev) {
                ev.preventDefault();
            }
        };

        $scope.$watch('query', function () {
            if ($scope.query) {
                $scope.search($scope.query);
            }
        });
    }
]);
