angular.module('tcp').controller('GuideController', [
    'RUNTIME',
    '$scope',
    '$timeout',
    'lodash',
    'ServicesService',
    function (RUNTIME, $scope, $timeout, lodash, ServicesService) {
        'use strict';

        $scope.counter = 42;
        $scope.tags = [];
        $scope.dates = [new Date()];

        $scope.menu = {
            show: false
        };

        $scope.chart_values = [
            54, 75, 49, 32, 12
        ];

        $scope.chart_y_labels = [
            '5 heart',
            '4 heart',
            '3 heart',
            '2 heart',
            '1 heart',
        ];

        $scope.goodjob = function () {
            window.alert('good job!');
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
    ServicesService.query.search.tags(RUNTIME.locale, str).then(function (tags) {
        done(null, lodash.map(tags, function (tag) {
            return {
                type: 'tag-approved-' + tag.approved.toString(),
                label: tag[RUNTIME.locale],
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
