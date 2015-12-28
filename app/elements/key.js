angular.module('tcp').directive('key', function () {
    'use strict';

    return {
        replace: true,
        template: '<div class="key is-non-selectable">{{::label}}</div>',
        scope: {
            label: '@'
        }
    };
});
