angular.module('tcp').directive('indicator', function () {
    return {
        replace: true,
        template: '<div>{{value}}</div>',
        scope: {
            value: '='
        },
        link: function (scope, elem, attrs) {
            elem.addClass('indicator indicator-' + attrs.type);
        }
    };
});
