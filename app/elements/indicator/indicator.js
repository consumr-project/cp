angular.module('tcp').directive('indicator', function () {
    'use strict';

    return {
        template: '<span class="indicator-useful__value-{{value}}">{{value}}</span>',
        scope: {
            value: '='
        },
        link: function (scope, elem, attrs) {
            elem.attr('tabindex', '0');
            elem.addClass('is-non-selectable indicator--' + attrs.type);
        }
    };
});
