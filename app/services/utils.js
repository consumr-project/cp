(function (store) {
    'use strict';

    /* global _ */

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
            .replace(/-+/g, '-')
            .replace(/[^a-zA-Z\d-]/g, '');
    }

    /**
     * history.pushState helper
     * @param {String} category
     * @param {String} id
     * @return {String} url
     */
    function state(category, id) {
        var url = '/' + [].splice.call(arguments, 0).join('/');

        if (location.pathname !== url) {
            history.pushState(url, null, url);
        }

        return url;
    }

    /**
     * @param {String} tag
     * @param {Object} [props]
     * @return {String}
     */
    function html(tag, props) {
        return [
            '<', tag, props ? ' ' : '',
                _.map(props, function (val, key) {
                    return key + '="' + val + '"';
                }).join(' '),
            '></', tag, '>'
        ].join('');
    }

    /**
     * @param {String} text
     * @return {String}
     */
    function summaryze(text) {
        var paragraphs = text.split('\n');
        return paragraphs[0];
    }

    store.html = html;
    store.state = state;
    store.semiguid = semiguid;
    store.preload = preload;
    store.opCallback = opCallback;
    store.noop = noop;
    store.summaryze = summaryze;
})(typeof window !== 'undefined' ? window.utils = {} : module.exports);
