angular.module('tcp').directive('feedback', [
    'Services',
    'Session',
    function (Services, Session) {
        'use strict';

        var template = [
            '<div class="feedback">',
            '    <div class="feedback__action" ng-click="take_feedback()">',
            '    </div>',
            '    <div',
            '        class="feedback__container"',
            '        anchored',
            '        anchored-element="\'.feedback__action\'"',
            '        anchored-show="vm.expand"',
            '        anchored-placement="right-bottom"',
            '        anchored-animation-offset="1"',
            '        anchored-left-offset="10"',
            '        anchored-arrow="true"',
            '        anchored-auto-hide="true"',
            '    >',
            '        <div class="feedback__opt feedback__opt--question" i18n="feedback/question"></div>',
            '        <div class="feedback__opt feedback__opt--suggestion" i18n="feedback/suggestion"></div>',
            '        <div class="feedback__opt feedback__opt--problem" i18n="feedback/problem"></div>',
            '    </div>',
            '</div>',
        ].join('');

        /**
         * @param {Angular.Scope} $scope
         */
        function controller($scope) {
            $scope.vm = {
                expand: false,
            };

            $scope.take_feedback = function () {
                $scope.vm.expand = true;
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
        };
    }
]);
