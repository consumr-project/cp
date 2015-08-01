angular.module('tcp').directive('article', function () {
    'use strict';

    return {
        replace: true,
        templateUrl: '/app/modules/article/article.html',
        scope: {
            highlighterApi: '=',
            onFoundUseful: '&',
            onHighlight: '&',
            onHighlightClick: '&',
            onNonHighlightClick: '&',
            info: '='
        },
        link: function (scope, elem, attr) {
            scope.isShort = attr.short;
        }
    };
});
