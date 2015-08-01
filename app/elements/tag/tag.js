angular.module('tcp').directive('tag', function () {
    'use strict';

    return {
        replace: true,
        transclude: true,
        template: '<div tabindex="0" class="tag-elem is-non-selectable">{{::label}}<ng-transclude></ng-transclude></div>',
        scope: {
            label: '@'
        }
    };
});
