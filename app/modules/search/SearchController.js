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
         * @param {*}
         * @return {*}
         */
        function doneLoading(arg) {
            $scope.loading = false;
            return arg;
        }

        /**
         * @param {String} query
         * @param {$http.Response} res
         */
        function handleResults(query, res) {
            var hits = res.data.hits.hits || [],
                hit = hits[0];

            switch (hits.length) {
                case 0:
                    $scope.results = { empty: true };
                    $scope.searches = RecentSearches.get();
                    break;

                case 1:
                    loadHit(hit);
                    break;

                default:
                    $scope.results = normalizeResults(hits);
                    trackSearch(query, hits);
                    break;
            }
        }

        /**
         * @param {Elasticsearch.Hit} hit
         * @return {Boolean}
         */
        function loadHit(hit) {
            if (hit._type in NavigationService) {
                NavigationService[hit._type](hit._id);
            }

            return hit._type in NavigationService;
        }

        /**
         * @param {Strings} query
         * @param {Object[]} [hits]
         */
        function trackSearch(query, hits) {
            if (hits && hits.length && !lodash.contains(RecentSearches.get(), query)) {
                RecentSearches.unshift(query);
            }
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
            $scope.searches = RecentSearches.get();

            NavigationService.search(query);
            ServicesService.search.fuzzy(query)
                .then(doneLoading)
                .then(handleResults.bind(null, query));
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
