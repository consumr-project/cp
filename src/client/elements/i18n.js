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

        /**
         * jQuery.prop/text helper
         * @param {jQuery} elem
         * @param {String} prop
         * @param {String} value
         */
        function setProp(elem, prop, value) {
            switch (prop) {
                case 'text':
                case 'innerText':
                    elem.text(value);
                    break;

                case 'html':
                case 'innerHTML':
                    elem.html(value);
                    break;

                default:
                    elem.attr(prop, value);
                    break;
            }
        }

        return {
            link: function (scope, elem, attrs) {
                var format = attrs.format || CONFIG.locate.dateFormat,
                    key = attrs.i18n || attrs.str,
                    prop = attrs.prop || 'innerText',
                    data = attrs.data,
                    date = attrs.date;

                setProp(elem, prop, key ?
                    i18n.get(key, scope.$eval(data)) :
                    moment(getDate(date)).format(format)
                );
            }
        };
    }
]);
