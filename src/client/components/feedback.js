angular.module('tcp').directive('feedback', [
    'DOMAIN',
    'Services',
    'Session',
    function (DOMAIN, Services, Session) {
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
            '        <div ng-click="message(type.question)"',
            '            class="feedback__opt feedback__opt--question"',
            '            i18n="feedback/question"></div>',

            '        <div ng-click="message(type.suggestion)"',
            '            class="feedback__opt feedback__opt--suggestion"',
            '            i18n="feedback/suggestion"></div>',

            '        <div ng-click="message(type.problem)"',
            '            class="feedback__opt feedback__opt--problem"',
            '            i18n="feedback/problem"></div>',
            '    </div>',
            '</div>',
        ].join('');

        /**
         * @param {Angular.Scope} $scope
         */
        function controller($scope) {
            $scope.type = DOMAIN.model.feedback_props.type;

            $scope.vm = {
                expand: false,
            };

            $scope.take_feedback = function () {
                $scope.vm.expand = true;
            };

            $scope.message = function (type) {
                console.log(type);
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
        };
    }
]);
