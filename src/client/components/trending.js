angular.module('tcp').directive('trending', [
    'Services',
    'utils',
    'lodash',
    function (Services, utils, lodash) {
        'use strict';

        /**
         * @param {Angular.Scope} $scope*
         */
        function controller($scope) {
            $scope.vm = {};

            Services.query.stats.trending()
                .then(utils.scope.set($scope, 'vm.trending'))
                .then(function (trending) {
                    lodash.each(trending, function (item) {
                        item.tag_labels = lodash.filter(item.tag_labels);
                    });
                });
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: [
                '<div>',
                '    <div class="snav__item snav__item--active" i18n="home/trending"></div>',
                '    <hr>',

                '    <ol>',
                '        <li class="trending--item" ng-repeat="item in vm.trending">',
                '            <span>{{item.title}}</span>',
                '            <div>',
                '                <tag class="keyword" label="{{tag}}"',
                '                    ng-repeat="tag in item.tag_labels"></tag>',
                '            <div>',
                '        </li>',
                '    </ol>',
                '</div>',
            ].join('')
        };
    }
]);
