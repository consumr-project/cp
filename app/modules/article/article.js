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
        },
        controller: ['$scope', function ($scope) {
            $scope.header_image = $scope.info.images && $scope.info.images[0];

            $scope.selectHeaderImage = function (image) {
                $scope.header_image = image;
            };
        }]
    };
});
