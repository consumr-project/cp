angular.module('tcp').directive('tag', function () {
    return {
        replace: true,
        template: '<div class="tag is-clickable" tabindex="1">{{::label}}</div>',
        scope: {
            label: '@'
        }
    };
});
