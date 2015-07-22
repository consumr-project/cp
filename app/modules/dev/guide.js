angular.module('tcp').controller('guideController', [
    '$scope',
    function ($scope) {
        $scope.counter = 42;
        $scope.tags = [];

        $scope.addTag = function () {
            $scope.tags.push({
                label: 'Tag #' + ($scope.tags.length + 1)
            });
        };

        $scope.incrementCounter = function () {
            $scope.counter++;
        };

        for (var i = 0; i < 30; i++)
            $scope.addTag();
    }
]);
