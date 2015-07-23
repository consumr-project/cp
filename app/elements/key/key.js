angular.module('tcp').directive('key', function () {
    return {
        replace: true,
        template: '<div class="key is-non-selectable">{{::label}}</div>',
        scope: {
            label: '@'
        }
    };
});
