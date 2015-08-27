angular.module('tcp').directive('i18n', [
    'i18n',
    function (i18n) {
        'use strict';

        return {
            link: function (scope, elem, attrs) {
                var key = attrs.i18n || attrs.str,
                    data = attrs.data || '{}';
                /* jshint evil: true */
                elem.text(i18n.get(key, eval(['(', data, ')'].join(''))));
            }
        };
    }
]);
