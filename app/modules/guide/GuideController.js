angular.module('tcp').controller('GuideController', [
    '$scope',
    function ($scope) {
        'use strict';

        $scope.counter = 42;
        $scope.tags = [];

        $scope.menu = {
            show: false
        };

        $scope.highlight = {
            count: 0,
            api: {}
        };

        $scope.toggleMenu = function () {
            $scope.menu.show = !$scope.menu.show;
        };

        $scope.onHighlight = function () {
            $scope.highlight.count++;
            $scope.$apply();
        };

        $scope.onHighlightClick = function (args) {
            $scope.highlight.api.remove(args.highlight);
            $scope.highlight.count--;
            $scope.$apply();
        };

        $scope.articles = [
            {
                title: 'Trader Joe\'s names as one of the most ethical companies in the world.',
                source_display: 'bloomberg.com',
                release_date: '12 July, 2015',
                useful_counter: 43,
                url: '#',
                external_url: '#'
            },
            {
                title: 'Trader Joe\'s names as one of the most ethical companies in the world.',
                source_display: 'bloomberg.com',
                release_date: '12 July, 2015',
                useful_counter: 43,
                url: '#',
                external_url: '#'
            },
            {
                title: 'Trader Joe\'s names as one of the most ethical companies in the world.',
                source_display: 'bloomberg.com',
                release_date: '12 July, 2015',
                useful_counter: 43,
                url: '#',
                external_url: '#'
            }
        ];

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
