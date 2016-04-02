angular.module('tcp').service('Feature', [
    'DEBUGGING',
    'CONFIG',
    'lodash',
    '$location',
    function (DEBUGGING, CONFIG, lodash, $location) {
        'use strict';

        var KEY_ENABLED = '.enabled',
            NS_FEATURE = 'CPFEATURE(%s, %s, %s)';

        var FEATURES = lodash.clone(CONFIG.features);

        /**
         * @param {String} feature
         * @return {Boolean}
         */
        function on(feature) {
            return Boolean(localStorage.getItem(ns(feature)) === 'true' ||
                lodash.get(FEATURES, feature + KEY_ENABLED));
        }

        /**
         * @param {String} feature
         * @return {Boolean}
         */
        function off(feature) {
            return !on(feature);
        }

        /**
         * @param {String} feature
         * @return {String}
         */
        function ns(feature) {
            return NS_FEATURE
                .replace('%s', feature)
                .replace('%s', CONFIG.environment.name)
                .replace('%s', location.host);
        }

        /**
         * @param {String} feature
         * @return {void}
         */
        function enable(feature) {
            localStorage.setItem(ns(feature), true);
        }

        /**
         * @param {String} feature
         * @return {void}
         */
        function disable(feature) {
            localStorage.setItem(ns(feature), false);
        }

        lodash.chain([].concat($location.search()._fon))
            .filter()
            .map(enable)
            .value();

        lodash.chain([].concat($location.search()._foff))
            .filter()
            .map(disable)
            .value();

        return {
            on: on,
            off: off,
            enable: enable,
            disable: disable,
        };
    }
]);
