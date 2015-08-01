angular.module('tcp').directive('indicator', function () {
    'use strict';

    return {
        template: '{{value}}',
        scope: {
            value: '='
        },
        link: function (scope, elem, attrs) {
            elem.attr('tabindex', '0');
            elem.addClass('is-clickable is-non-selectable indicator-' + attrs.type);

            if (attrs.type === 'useful' && scope.value === 0) {
                scope.value = '';
            }
        }
    };
});
