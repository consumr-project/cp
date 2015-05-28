angular.module('tcp').controller('postController', ['$scope', 'postService', 'extract', function ($scope, postService, extract) {
    $scope.editing = true;

    // XXX - remove once done testing
    $scope.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';

    $scope.fetchArticle = function () {
        if ($scope.url) {
            extract.fetch($scope.url).then(function (article) {
                $scope.article = article;
            });
        }
    };

    $scope.edit = function () {
        $scope.editing = true;
    };

    $scope.save = function () {
        $scope.editing = false;
    };
}]);
