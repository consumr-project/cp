angular.module('tcp').directive('indicator', function () {
    return {
        replace: true,
        template: '<div class="is-clickable is-non-selectable" tabindex="1">{{value}}</div>',
        scope: {
            value: '='
        },
        link: function (scope, elem, attrs) {
            elem.addClass('indicator indicator-' + attrs.type);
        }
    };
});
