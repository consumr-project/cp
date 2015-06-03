'use strict';

/* global reqwest, _ */

(function (store) {
    /**
     * @param {String} url
     * @param {Object} [params]
     * @return {Promise<Object>}
     */
    function get(url, params) {
        if (params) {
            url += '?' + _.map(params, function (val, param) {
                return [param, encodeURIComponent(val)].join('=');
            }).join('&');
        }

        return reqwest({ url, url });
    }

    store.get = get;
})(typeof window !== 'undefined' ? window.api = {} : module.exports);
