angular.module('tcp').service('ServicesService', ['$http', function ($http) {
    'use strict';

    var extractService = {},
        searchService = {};

    /**
     * @param {String} url
     * @return {Promise}
     */
    extractService.page = function (url) {
        return $http.get('/service/extract/page?url=' + encodeURIComponent(url));
    };

    /**
     * interface SearchConfiguration {
     *     index: String (default: entity)
     *     type: String (default: undefined)
     *     size: Number (default: 50)
     *     from: Number (default: 0)
     * }
     *
     * @param {String} str
     * @param {SearchConfiguration} [config]
     * @return {Promise}
     */
    searchService.fuzzy = function (str, config) {
        config = config || {};
        return $http.get('/service/search/fuzzy', {
            params: {
                query: str,
                index: config.index || 'entity',
                type: config.type,
                size: config.size || 50,
                from: config.from || 0
            }
        });
    };

    return {
        extract: extractService,
        search: searchService
    };
}]);
