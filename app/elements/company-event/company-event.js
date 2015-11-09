angular.module('tcp').directive('companyEvent', [
    'extract',
    'tag',
    function (extract, tag) {
        'use strict';

        /**
         * @param {Object} ref
         * @param {Object} data
         */
        function populateEvent(ref, data) {
            ref.title = data.title;
            ref.description = data.description;
            ref.date = data.published;
            ref.$date = new Date(data.published);
        }

        /**
         * @param {Object} ref
         */
        function clearEvent(ref) {
            delete ref.title;
            delete ref.description;
            delete ref.date;
            delete ref.$date;
        }

        function controller($scope) {
            $scope.vm = {};

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

                $scope.vm.fetchingArticle = true;
                clearEvent($scope.ev);

                extract.fetch(source).then(function (content) {
                    $scope.vm.fetchingArticle = false;
                    populateEvent($scope.ev, content);
                    $scope.$apply();
                });
            });
        }

        return {
            replace: true,
            templateUrl: '/app/elements/company-event/company-event.html',
            scope: { onCancel: '&' },
            controller: ['$scope', controller]
        };
    }
]);
