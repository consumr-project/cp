(function (store) {
    'use strict';

    /* global reqwest, _ */

    /**
     * @param {Object}
     * @return {String}
     */
    function stringify(params) {
        return _.map(params, function (val, key) {
            return [key, encodeURIComponent(val)].join('=');
        }).join('&');
    }

    /**
     * generate a google search url
     * @param {Object}
     * @return {String}
     */
    function url(type) {
        return 'http://ajax.googleapis.com/ajax/services/search/' + type + '?';
    }

    /**
     * make a call to google's api
     * @param {String} search type (web/images/etc.)
     * @param {String} search query
     * @return {Promise}
     */
    function api(type, query) {
        return reqwest({
            type: 'jsonp',
            url: url(type) + stringify({
                v: '1.0',
                q: query,
                callback: 'JSON_CALLBACK',
            })
        });
    }

    store.images = api.bind(null, 'images');
})(typeof window !== 'undefined' ? window.google = {} : module.exports);
