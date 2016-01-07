angular.module('tcp').controller('GuideController', [
    '$scope',
    '$timeout',
    'lodash',
    'ServicesService',
    function ($scope, $timeout, lodash, ServicesService) {
        'use strict';

        $scope.counter = 42;
        $scope.tags = [];
        $scope.dates = [new Date()];

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
                type: Math.random() > 0.5 ? 'positive' : 'negative'
            });
        };

        $scope.incrementCounter = function () {
            $scope.counter++;
        };

// keep indentation
$scope.create_selection = function (str, done) {
    $timeout(function () {
        done(null, {
            type: 'tag-approved-false',
            id: Math.random().toString(),
            label: str
        });
    }, 3000);
};

// keep indentation
$scope.query_selections = function (str, done) {
    ServicesService.query.search.tags('en-US', str).then(function (tags) {
        done(null, lodash.map(tags, function (tag) {
            return {
                type: 'tag-approved-' + tag.approved.toString(),
                label: tag['en-US'],
                id: tag.id
            };
        }));
    }).catch(done);
};

        for (var i = 0; i < 2; i++) {
            $scope.addTag();
        }
    }
]);
