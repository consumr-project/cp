angular.module('tcp').directive('tag', function () {
    return {
        replace: true,
        template: '<div class="tag">{{::label}}</div>',
        scope: {
            label: '@'
        }
    };
});
