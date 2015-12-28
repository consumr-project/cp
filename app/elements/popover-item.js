angular.module('tcp').directive('popoverItem', function () {
    'use strict';

    return {
        replace: true,
        transclude: true,
        template: '<div class="popover__item"><ng-transclude></ng-transclude></div>'
    };
});
