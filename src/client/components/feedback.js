angular.module('tcp').directive('feedback', [
    'DOMAIN',
    'Services',
    'Session',
    function (DOMAIN, Services, Session) {
        'use strict';

        var template = [
            '<div class="feedback">',
            '    <div class="feedback__action" ng-click="start()">',
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
            '        <section ng-class="{',
            '            \'feedback__container--adding\': vm.type,',
            '            \'feedback__container--adding--question\': vm.type === type.question,',
            '            \'feedback__container--adding--suggestion\': vm.type === type.suggestion,',
            '            \'feedback__container--adding--problem\': vm.type === type.problem,',
            '        }">',
            '            <div ng-click="vm.type = type.question"',
            '                class="feedback__opt feedback__opt--question"',
            '                i18n="feedback/question"></div>',

            '            <div ng-click="vm.type = type.suggestion"',
            '                class="feedback__opt feedback__opt--suggestion"',
            '                i18n="feedback/suggestion"></div>',

            '            <div ng-click="vm.type = type.problem"',
            '                class="feedback__opt feedback__opt--problem"',
            '                i18n="feedback/problem"></div>',
            '            <div class="feedback__message">',
            '                <textarea i18n="feedback/whats_up" prop="placeholder"',
            '                    class="textarea--inlined"></textarea>',
            '                <button i18n="admin/submit"></button>',
            '            </div>',
            '        </section>',
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
                type: null,
            };

            $scope.start = function () {
                $scope.vm.expand = true;
                $scope.vm.type = null;
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
        };
    }
]);
