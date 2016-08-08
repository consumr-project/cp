angular.module('tcp').controller('GuideController', [
    'RUNTIME',
    '$scope',
    '$timeout',
    '$interval',
    'lodash',
    'Services',
    function (RUNTIME, $scope, $timeout, $interval, lodash, Services) {
        'use strict';

        function randombetween(min, max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        function generate(max, thecount) {
            var r = [];
            var currsum = 0;

            for(var i = 0; i < thecount - 1; i++) {
                r[i] = randombetween(1, max-(thecount-i-1)-currsum);
                currsum += r[i];
            }

            r[thecount-1] = max - currsum;
            return r;
        }

        $scope.counter = 42;
        $scope.tags = [];
        $scope.dates = [new Date()];

        $scope.menu = {
            show: false
        };

        $interval(function () {
            $scope.chart_values = generate(100, 5);
        }, 3000);

        $scope.chart_values = generate(100, 5);
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
    Services.query.search.tags(RUNTIME.locale, str).then(function (tags) {
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
