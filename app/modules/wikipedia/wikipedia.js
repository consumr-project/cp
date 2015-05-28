'use strict';

angular.module('wikipedia', []).service('wikipedia', ['$http', 'lodash', function ($http, _) {
    /**
     * make a call to wikipedia's api
     * @param {Object} params
     * @return {Promise}
     */
    function api(params) {
        params.format = 'json';
        params.callback = 'JSON_CALLBACK';

        return $http.jsonp('https://en.wikipedia.org/w/api.php?' + _.map(params, function (val, key) {
            return [key, encodeURIComponent(val)].join('=');
        }).join('&'));
    }

    /**
     * @param {String} object name of object you want to get out of
     * res.data.query response object
     * @return {Function} function that get's that object once called
     */
    function best(object) {
        return function (res) {
            var all = res.data.query[object],
                best = {};

            for (var id in all) {
                best = all[id];
                best._matches = all;
                break;
            }

            return best;
        };
    }

    /**
     * extract a page's description
     * @param {String} title
     * @return {Promise<Object>}
     */
    function extract(title) {
        return api({
            action: 'query',
            prop: 'extracts',
            exintro: '',
            explaintext: '',
            titles: title,
        }).then(best('pages'));
    }

    return {
        extract: extract
    };
}]);
