angular.module('tcp').directive('reviews', [
    'lodash',
    'utils',
    'i18n',
    'Services',
    'Session',
    function (lodash, utils, i18n, Services, Session) {
        'use strict';

        /**
         * @return {String[]}
         */
        function get_chart_labels() {
            return lodash.times(5, function (count) {
                return i18n.get('common/heart_count', { count: count + 1 });
            }).reverse();
        }

        /**
         * takes a company review summary response and converts it to an
         * array of scores
         * @param {CompanyReportSummary} summary_all
         * @return {Number[]}
         */
        function list_scores(summary_all) {
            return lodash.reduce(summary_all, function (scores, summary) {
                scores[summary.score] = summary.score_count;
                return scores;
            }, [0, 0, 0, 0, 0]).reverse();
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.vm = {};
            $scope.reviews = {};
            $scope.vm.chart_labels = get_chart_labels();

            Services.query.companies.reviews($scope.companyId)
                .then(utils.scope.set($scope, 'reviews.list'));

            Services.query.companies.reviews.summary($scope.companyId)
                .then(list_scores)
                .then(utils.scope.set($scope, 'reviews.summary'));
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                companyId: '@'
            },
            template: [
                '<div>',
                '    <chart type="hbar" values="reviews.summary"',
                '        y-labels=":: vm.chart_labels"></chart>',
                '    <div ng-repeat="review in :: reviews.list"',
                '       class="margin-top-large">',
                '       <table>',
                '           <tr>',
                '               <td>',
                '                   <avatar email="{{::review.user_email}}" class="image-only"></avatar>',
                '               </td>',
                '               <td class="padding-left-small">',
                '                   <chart type="heartcount" value="::review.score"></chart>',
                '               </td>',
                '           </tr>',
                '       </table>',
                '       <h2 class="margin-top-small">{{::review.title}}</h2>',
                '       <span class="uppercase font-size-small" prop="html" i18n="user/by_on" data="{',
                '           id: review.user_id,',
                '           name: review.user_name,',
                '           date: review.created_date,',
                '       }"></span>',
                '       <q class="copy block margin-top-small">{{::review.summary}}</q>',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
