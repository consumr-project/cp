'use strict';

/* global reqwest */

(function (store) {
    /**
     * @param {String} object
     * @return {Function}
     */
    function pluck(object) {
        return function (res) {
            return res[object];
        };
    }

    /**
     * extract a page's content
     * @param {String} url
     * @return {Promise<Object>}
     */
    function fetch(url) {
        return reqwest({ url: '/extract?url=' + encodeURIComponent(url) })
            .then(pluck('response'));
    }

    store.fetch = fetch;
})(typeof window !== 'undefined' ? window.extract = {} : module.exports);
