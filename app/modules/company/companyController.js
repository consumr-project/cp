angular.module('tcp').controller('companyController', ['$scope', 'wikipedia', function ($scope, wikipedia) {
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
}]);
