angular.module('tcp').directive('feedback', [
    'utils',
    'DOMAIN',
    'Services',
    'Session',
    function (utils, DOMAIN, Services, Session) {
        'use strict';

        var STAT = {
            SUCCESS: 1,
            FAILURE: 2,
        };

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
            '        anchored-bottom-offset="0"',
            '        anchored-arrow="true"',
            '        anchored-auto-hide="true"',
            '    >',
            '        <section class="can-load" ng-class="{',
            '            \'loading\': vm.loading,',
            '            \'feedback__container--adding\': vm.type,',
            '            \'feedback__container--adding--question\': vm.type === type.question,',
            '            \'feedback__container--adding--suggestion\': vm.type === type.suggestion,',
            '            \'feedback__container--adding--problem\': vm.type === type.problem,',
            '            \'feedback__container--status\': vm.status,',
            '            \'feedback__container--status--success\': vm.status === STAT.SUCCESS,',
            '            \'feedback__container--status--failure\': vm.status === STAT.FAILURE,',
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

            '            <div class="feedback__opt feedback__opt--failure"',
            '                i18n="admin/oops"></div>',

            '            <div class="feedback__opt feedback__opt--success"',
            '                i18n="admin/thanks"></div>',

            '            <div class="feedback__message">',
            '                <textarea i18n="feedback/whats_up" prop="placeholder"',
            '                    class="textarea--inlined"',
            '                    ng-model="vm.message"',
            '                    ng-focus="vm.type"></textarea>',
            '                <button ng-disabled="vm.loading" i18n="admin/submit"',
            '                    ng-click="submit()"></button>',
            '            </div>',

            '            <div class="feedback__response">',
            '                <p class="feedback__response--question"',
            '                    i18n="admin/thanks_for_question"></p>',
            '                <p class="feedback__response--suggestion"',
            '                    i18n="admin/thanks_for_suggestion"></p>',
            '                <p class="feedback__response--problem"',
            '                    i18n="admin/thanks_for_bug_report"></p>',
            '                <p class="feedback__response--failure"',
            '                    i18n="admin/try_later"></p>',
            '            </div>',
            '        </section>',
            '    </div>',
            '</div>',
        ].join('');

        /**
         * @return {Object}
         */
        function clean_state() {
            return {
                loading: false,
                expand: false,
                status: null,
                type: null,
                message: '',
            };
        }

        /**
         * @param {Angular.Scope} $scope
         */
        function controller($scope) {
            $scope.type = DOMAIN.model.feedback_props.type;

            $scope.vm = clean_state();
            $scope.STAT = STAT;

            $scope.start = function () {
                if ($scope.vm.expand) {
                    return;
                }

                utils.assert(Session.USER && Session.USER.id, 'login required for action');
                $scope.vm = clean_state();
                $scope.vm.expand = true;
            };

            $scope.submit = function () {
                utils.assert(Session.USER, 'login required for action');
                utils.assert(Session.USER.id, 'login required for action');
                utils.assert($scope.vm.type);
                utils.assert($scope.vm.message);

                $scope.vm.loading = true;

                Services.query.feedback.create({
                    id: Services.query.UUID,
                    referrer: location.href,
                    user_id: Session.USER.id,
                    type: $scope.vm.type,
                    message: $scope.vm.message,
                    created_by: Session.USER.id,
                    updated_by: Session.USER.id,
                }).then(function () {
                    $scope.vm.loading = false;
                    $scope.vm.status = STAT.SUCCESS;
                }).catch(function () {
                    $scope.vm.loading = false;
                    $scope.vm.status = STAT.FAILURE;
                });
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
        };
    }
]);
