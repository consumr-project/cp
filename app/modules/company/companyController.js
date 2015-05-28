angular.module('tcp').controller('companyController', ['$scope', 'wikipedia', function ($scope, wikipedia) {
    $scope.editing = true;

    /**
     * @return {Boolean}
     */
    function shouldFecthDescription() {
        return $scope.name && !$scope.description;
    }

    $scope.fetchCompanyDescription = function () {
        if (shouldFecthDescription()) {
            wikipedia.extract($scope.name).then(function (page) {
                if (page && page.extract && shouldFecthDescription()) {
                    $scope.description = page.extract;
                }
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
