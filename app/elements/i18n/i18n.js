angular.module('tcp').directive('i18n', [
    'i18n',
    'moment',
    function (i18n, moment) {
        'use strict';

        return {
            link: function (scope, elem, attrs) {
                var key = attrs.i18n || attrs.str,
                    data = attrs.data || '{}',
                    date = attrs.date,
                    format = attrs.format || 'LL';

                if (key) {
                    /* jshint evil: true */
                    elem.text(i18n.get(key, eval(['(', data, ')'].join(''))));
                } else if (date) {
                    elem.text(moment(isFinite(date) ? +date : date).format(format));
                }
            }
        };
    }
]);
