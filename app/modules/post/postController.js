angular.module('tcp').controller('postController', ['$scope', 'postService', 'extract', function ($scope, postService, extract) {
    $scope.loading = false;
    $scope.editing = true;
    $scope.article = null;

    // XXX - remove once done testing
    $scope.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';

    $scope.fetchArticle = function () {
        if ($scope.url) {
            $scope.loading = true;;
            $scope.article = null;

            extract.fetch($scope.url).then(function (article) {
                $scope.loading = false;;
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
