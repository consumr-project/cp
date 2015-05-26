angular.module('tcp').controller('postController', ['postService', '$scope', function (postService, $scope) {
  $scope.postIt = function () {
    postService.add({
      company: $scope.postCompany,
      link: $scope.postLink,
      tags: $scope.postTags,
    });
  };
}]);