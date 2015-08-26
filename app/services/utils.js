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

    /**
     * @return {Object}
     */
    function createListener() {
        var events = {};

        /**
         * @param {String} name
         * @param {Array} args
         */
        function trigger(name, args) {
            _.each(events[name], function (fn) {
                fn.apply(null, args || []);
            });
        }

        /**
         * @param {String} name
         * @param {Function} handler
         * @return {Function} remove listener
         */
        function on(name, handler) {
            if (!(name in events)) {
                events[name] = [];
            }

            events[name].push(handler);

            return function () {
                _.remove(events[name], function (fn) {
                    return handler === fn;
                });
            };
        }

        /**
         * injects an object with event listener functions
         * @param {Object} obj
         * @return {Object}
         */
        function listener(obj) {
            obj.on = on;
            obj.trigger = trigger;
            return obj;
        }

        return {
            listener: listener,
            on: on,
            trigger: trigger,
        };
    }

    store.createListener = createListener;
    store.html = html;
    store.noop = noop;
    store.opCallback = opCallback;
    store.preload = preload;
    store.semiguid = semiguid;
    store.state = state;
    store.summaryze = summaryze;
})(typeof window !== 'undefined' ? window.utils = {} : module.exports);
