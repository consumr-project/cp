angular.module('tcp').directive('tag', function () {
    return {
        replace: true,
        transclude: true,
        template: '<div class="tag is-clickable is-non-selectable" tabindex="0">{{::label}}<ng-transclude></ng-transclude></div>',
        scope: {
            label: '@'
        }
    };
});
