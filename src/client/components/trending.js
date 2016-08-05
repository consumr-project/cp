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
                .then(utils.scope.set($scope, 'vm.trending'));
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: [
                '<div class="trending-component">',
                '    <ol>',
                '        <li class="trending--item" ng-repeat="item in vm.trending">',
                '            <p>{{item.title}}</p>',
                '            <tags show-hide="false">',
                '                <tag class="keyword" label="{{company.label}}"',
                '                    ng-repeat="company in item.companies"></tag>',
                '                <tag class="keyword" label="{{tag.label}}"',
                '                    ng-repeat="tag in item.tags"></tag>',
                '            <tags>',
                '        </li>',
                '    </ol>',
                '</div>',
            ].join('')
        };
    }
]);
