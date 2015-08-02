angular.module('tcp').controller('guideController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        'use strict';

        $scope.counter = 42;
        $scope.tags = [];

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

        $http.get('/public/icons/selection.json').then(function (res) {
            $scope.icons = res.data.icons;
        });
    }
]);
