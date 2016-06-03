angular.module('tcp').directive('review', [
    'utils',
    'Services',
    'Session',
    function (utils, Services, Session) {
        'use strict';

        var HTML_VIEW = [
            '<div>',
            '    <table>',
            '        <tr>',
            '            <td>',
            '                <avatar email="{{::model.user_email}}" class="image-only"></avatar>',
            '            </td>',
            '            <td class="padding-left-small">',
            '                <chart type="heartcount" value="{{::model.score}}"></chart>',
            '            </td>',
            '        </tr>',
            '    </table>',
            '    <h2 class="margin-top-small">{{::model.title}}</h2>',
            '    <span class="uppercase font-size-small" prop="html" i18n="user/by_on" data="{',
            '        id: model.user_id,',
            '        name: model.user_name,',
            '        date: model.created_date,',
            '    }"></span>',
            '    <q class="copy block margin-top-small">{{::model.summary}}</q>',
            '</div>',
        ].join('');

        var HTML_EDIT = [
            '<div class="not-half-width-but-not-full-either">',
            '    <h1 i18n="review/comfort" data="{name: companyName}"></h1>',
            '    <chart class="margin-top-large margin-bottom-xlarge"',
            '        type="heartcount" editable="true" on-change="vm.score = value"></chart>',
            '    <input class="block title" prop="placeholder" i18n="review/title_placeholder"',
            '        ng-model="vm.title" />',
            '    <textarea class="full-span textarea--inlined textarea--summary margin-top-small"',
            '        prop="placeholder" i18n="review/summary_placeholder"',
            '        ng-model="vm.summary"></textarea>',
            '    <button i18n="admin/save" ng-click="save()"></button>',
            '    <button i18n="admin/cancel" ng-click="onCancel()" class="button--link"></button>',
            '</div>',
        ].join('');

        function template(elem, attrs) {
            return attrs.type === 'view' ? HTML_VIEW : HTML_EDIT;
        }

        /**
         * @param {Angular.Scope} $scope
         */
        function controller($scope) {
            $scope.vm = {
                score: 0,
                title: '',
                summary: '',
            };

            /**
             * @return {Promise}
             */
            $scope.save = function () {
                var score = $scope.vm.score;

                utils.assert(Session.USER.id, 'must be logged in');
                utils.assert(score >= 0 && score <= 5, 'review score between 0-5');
                utils.assert($scope.vm.title, 'review title required');
                utils.assert($scope.vm.summary, 'review summary required');

                return Services.query.companies.reviews.create($scope.companyId, {
                    id: Services.query.UUID,
                    user_id: Session.USER.id,
                    score: $scope.vm.score,
                    title: $scope.vm.title,
                    summary: $scope.vm.summary,
                    created_by: Session.USER.id,
                    updated_by: Session.USER.id,
                }).then($scope.onSave);
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
            scope: {
                model: '=',
                companyId: '@',
                companyName: '@',
                onCancel: '&',
                onSave: '&',
            },
        };
    }
]);
