'use strict';

angular.module('extract', []).service('extract', ['$http', function ($http) {
    /**
     * extract a page's content
     * @param {String} url
     * @return {Promise<Object>}
     */
    function fetch(url) {
        return $http.get('/extract?url=' + encodeURIComponent(url));
    }

    return {
        fetch: fetch
    };
}]);
