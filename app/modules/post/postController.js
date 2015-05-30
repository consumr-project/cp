angular.module('tcp').controller('postController', ['$scope', '$window', 'postService', 'extract', 'rangy', function ($scope, $window, postService, extract, rangy) {
    var highlighter;

    $scope.loading = false;
    $scope.editing = true;

    $scope.initialize = function () {
        rangy.init();

        highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier('highlight', {
            ignoreWhiteSpace: true,
            tagNames: ['span']
        }));
    };

    $scope.selectionMade = function () {
        highlighter.highlightSelection('highlight');
        $window.getSelection().removeAllRanges();
    };

    $scope.fetchArticle = function () {
        if (!$scope.url) {
            return;
        }

        $scope.loading = true;;
        $scope.article = null;

        extract.fetch($scope.url).then(function (article) {
            if (!article.ok) {
                alert('Error loading article');
            } else {
                $scope.article = article;
            }

            $scope.loading = false;
            $scope.$apply();
        });
    };

    $scope.edit = function () {
        $scope.editing = true;
    };

    $scope.save = function () {
        $scope.editing = false;
    };

    // XXX - remove once done testing
    $scope.company = 'Hormel';
    $scope.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
    $scope.fetchArticle();
}]);
