angular.module('tcp').directive('tag', function () {
    return {
        replace: true,
        template: '<div class="tag is-clickable">{{::label}}</div>',
        scope: {
            label: '@'
        }
    };
});
