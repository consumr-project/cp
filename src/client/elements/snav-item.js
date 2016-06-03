angular.module('tcp').directive('snavItem', function () {
    'use strict';

    var template = '<div class="snav__item"><ng-transclude></ng-transclude></div>';

    return {
        replace: true,
        transclude: true,
        template: template,
    };
});
