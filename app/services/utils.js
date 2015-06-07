(function (store) {
    'use strict';

    /**
     * @param {String} url
     * @param {Function} [callback]
     * @return {Image}
     */
    function preload(url, callback) {
        var img = new Image();
        img.onload = callback;
        img.onerror = callback;
        img.src = url;
        return img;
    }

    /**
     * nothing
     */
    function noop() {
    }

    /**
     * @param {Function} callback
     * @return {Function}
     */
    function opCallback(callback) {
        return callback || noop;
    }

    /**
     * a semi-globally unique id
     * @param {String} str
     * @return {String}
     */
    function semiguid(str) {
        return str.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^a-zA-Z\d-]/g, '');
    }

    store.semiguid = semiguid;
    store.preload = preload;
    store.opCallback = opCallback;
})(typeof window !== 'undefined' ? window.utils = {} : module.exports);
