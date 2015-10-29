// XXX move out of this file
angular.module('tcp').service('SearchService', [
    '$q',
    'store',
    'lodash',
    function ($q, store, lodash) {
        var COMPANY = { _type: 'company' },
            USER = { _type: 'user' };

        return {
            entity: entity,
            search: search
        };

        /**
         * @param {String} query
         * @return {Promise}
         */
        function entity(query) {
            return search('entity', '', query);
        };

        /**
         * @param {String} index
         * @param {String} type
         * @param {String} query
         * @return {Promise}
         */
        function search(index, type, query) {
            return $q(function (resolve, reject) {
                var job = store.child('search').push({
                    index: index,
                    type: type,
                    query: query
                });

                store.child('search').child(job.key()).on('value', function handler(res) {
                    var results = res.val();

                    if (lodash.isString(results)) {
                        res.ref().off('value', handler);
                        res.ref().remove();

                        results = JSON.parse(results);
                        results.$all = results.hits.hits;
                        results.$companies = lodash.where(results.hits.hits, COMPANY);
                        results.$users = lodash.where(results.hits.hits, USER);

                        resolve(results);
                    }
                });
            });
        }
    }
]);

angular.module('tcp').controller('searchController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    'SearchService',
    function ($scope, $routeParams, NavigationService, SearchService) {
        'use strict';

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
            SearchService.entity(query).then(function (res) {
                $scope.loading = false;
                $scope.results.company = res.$companies;
                $scope.results.user = res.$users;
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
