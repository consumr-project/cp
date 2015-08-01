angular.module('tcp').directive('popover', function () {
    'use strict';

    return {
        replace: true,
        transclude: true,
        template: '<div class="popover"><ng-transclude></ng-transclude></div>'
    };
});
