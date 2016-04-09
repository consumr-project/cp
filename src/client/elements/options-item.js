angular.module('tcp').directive('optionsItem', function () {
    'use strict';

    return {
        replace: true,
        transclude: true,
        template: '<span class="options__item"><ng-transclude></ng-transclude></span>'
    };
});
