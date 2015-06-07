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

    store.preload = preload;
})(typeof window !== 'undefined' ? window.utils = {} : module.exports);
