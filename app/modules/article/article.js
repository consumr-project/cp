angular.module('tcp').directive('article', function () {
    'use strict';

    return {
        replace: true,
        templateUrl: '/app/modules/article/article.html',
        scope: {
            info: '='
        },
        link: function (scope, elem, attr) {
            scope.isShort = attr.short;
        }
    };
});
