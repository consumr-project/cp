angular.module('tcp').directive('i18n', [
    'CONFIG',
    'i18n',
    'moment',
    function (CONFIG, i18n, moment) {
        'use strict';

        /**
         * @param {String} date
         * @return {Number|String}
         */
        function getDate(date) {
            return isFinite(date) ? +date : date;
        }

        return {
            link: function (scope, elem, attrs) {
                var format = attrs.format || CONFIG.locate.dateFormat,
                    key = attrs.i18n || attrs.str,
                    data = attrs.data,
                    date = attrs.date;

                if (key) {
                    elem.text(i18n.get(key, scope.$eval(data)));
                } else if (date) {
                    elem.text(moment(getDate(date)).format(format));
                }
            }
        };
    }
]);
