angular.module('tcp').directive('trending', [
    'Services',
    'utils',
    function (Services, utils) {
        'use strict';

        /**
         * @param {Angular.Scope} $scope*
         */
        function controller($scope) {
            $scope.vm = {};

            Services.query.stats.trending()
                .then(utils.scope.set($scope, 'vm.trending'));
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: [
                '<div>',
                '    <h1 i18n="home/trending"></h1>',
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
