'use strict';

angular.module('extract', []).service('extract', ['$http', function ($http) {
    /**
     * @param {String} object
     * @return {Function}
     */
    function pluck(object) {
        return function (res) {
            return res.data[object];
        };
    }

    /**
     * extract a page's content
     * @param {String} url
     * @return {Promise<Object>}
     */
    function fetch(url) {
        return $http.get('/extract?url=' + encodeURIComponent(url))
            .then(pluck('response'));
    }

    return {
        fetch: fetch
    };
}]);
