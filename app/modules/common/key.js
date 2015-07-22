angular.module('tcp').directive('key', function () {
    return {
        replace: true,
        template: '<div class="key">{{::label}}</div>',
        scope: {
            label: '@'
        }
    };
});
