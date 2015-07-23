angular.module('tcp').directive('tag', function () {
    'use strict';

    return {
        transclude: true,
        template: '{{::label}}<ng-transclude></ng-transclude>',
        scope: {
            label: '@'
        },
        link: function (scope, elem) {
            elem.attr('tabindex', '0');
            elem.addClass('is-clickable is-non-selectable');
        }
    };
});
