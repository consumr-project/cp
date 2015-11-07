angular.module('tcp').directive('companyEvent', [
    'extract',
    function (extract) {
        'use strict';

        return {
            replace: true,
            templateUrl: '/app/elements/company-event/company-event.html',
            controller: ['$scope', function ($scope) {
                $scope.vm = {
                    loading: false
                };

                $scope.ev = {
                    title: '',
                    sources: [],
                };

                // XXX
                setTimeout(function () {
                $scope.ev.sources.push('http://www.bbc.com/news/world-europe-34742273');
                $scope.$apply();
                }, 500);

                $scope.$watch('ev.sources[0]', function (source) {
                    if (!source) {
                        return;
                    }

                    extract.fetch(source).then(function (content) {
                        $scope.ev.title = content.title;
                        $scope.ev.description = content.description;
                        $scope.ev.date = content.published;
                        $scope.ev.$date = new Date(content.published);
                        $scope.$apply();
                    });
                });
            }]
        };
    }
]);