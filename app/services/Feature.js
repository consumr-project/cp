angular.module('tcp').service('Feature', [
    'DEBUGGING',
    'CONFIG',
    'lodash',
    function (DEBUGGING, CONFIG, lodash) {
        'use strict';

        var KEY_ENABLED = '.enabled';

        var FEATURES = lodash.clone(CONFIG.features);

        /**
         * @param {String} feature
         * @return {Boolean}
         */
        function on(feature) {
            return Boolean(lodash.get(FEATURES, feature + KEY_ENABLED));
        }

        /**
         * @param {String} feature
         * @return {Boolean}
         */
        function off(feature) {
            return !on(feature);
        }

        return {
            on: on,
            off: off,
        };
    }
]);
