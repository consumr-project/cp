angular.module('tcp').service('logger', [
    'DEBUGGING',
    'utils',
    function (DEBUGGING, utils) {
        'use strict';

        /**
         * @return {String}
         */
        function label(name) {
            return ['[', name, ']'].join('');
        }

        /**
         * @return {String}
         */
        function timestamp() {
            return ['(', (new Date()).toJSON(), ')'].join('');
        }

        /**
         * @param {String} name
         * @param {String} fn name of console function to call
         * @return {Function} logger function
         */
        function logger(name, fn) {
            return !DEBUGGING ? utils.noop : function () {
                var args = [].splice.call(arguments, 0);

                if (args[0]) {
                    args[0] = [label(name), args[0], timestamp()].join(' ');
                }

                console[fn].apply(console, args);
            };
        }

        /**
         * @param {String} logger name
         * @return {Function} logger function
         */
        return function (name) {
            var log = logger(name, 'info');

            log.error = logger(name, 'error');
            log.info = logger(name, 'info');
            log.log = logger(name, 'log');
            log.warn = logger(name, 'warn');

            return log;
        };
    }
]);
