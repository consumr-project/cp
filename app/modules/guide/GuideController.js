angular.module('tcp').controller('GuideController', [
    '$scope',
    function ($scope) {
        'use strict';

        $scope.counter = 42;
        $scope.tags = [];

        $scope.menu = {
            show: false
        };

        $scope.toggleMenu = function () {
            $scope.menu.show = !$scope.menu.show;
        };

        $scope.addTag = function () {
            $scope.tags.push({
                counter: parseInt(Math.random() * 100),
                label: 'Tag #' + ($scope.tags.length + 1),
                type: Math.random() > 0.5 ? 'good' : 'bad'
            });
        };

        $scope.incrementCounter = function () {
            $scope.counter++;
        };

        for (var i = 0; i < 2; i++) {
            $scope.addTag();
        }
    }
]);
