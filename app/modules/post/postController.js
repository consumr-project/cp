angular.module('tcp').controller('postController', ['$scope', 'postService', 'extract', function ($scope, postService, extract) {
    $scope.loading = false;
    $scope.editing = true;

    // XXX - remove once done testing
    $scope.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';

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
}]);
