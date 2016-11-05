angular.module('tcp').directive('reviews', [
    'lodash',
    'utils',
    'i18n',
    'Services',
    'Session',
    function (lodash, utils, i18n, Services, Session) {
        'use strict';

        var SCORE_LIST_LEN = 6;

        var ORDER_TIME = 'time',
            ORDER_USEFULNESS = 'usefulness';

        /**
         * @return {String[]}
         */
        function get_chart_labels() {
            return lodash.times(SCORE_LIST_LEN, function (count) {
                return i18n.get('common/heart_count', { count: count });
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
            }, lodash.range(0, SCORE_LIST_LEN, 0)).reverse();
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            var offset = 0;

            $scope.vm = {
                viewing_all: false,
                loading: false,
                chart_labels: get_chart_labels(),
            };

            $scope.reviews = {
                list: [],
                summary: [],
            };

            /**
             * @param {Review} review
             * @param {Number} score
             * @return {Promise}
             */
            $scope.useful = function (review, score) {
                utils.assert(Session.USER.id, 'login required for action');
                utils.assert(score && review && review.id);

                review.user_useful_neg = score < 0;
                review.user_useful_pos = score > 0;

                return Services.query.reviews.useful.upsert(review.id, {
                    score: score,
                    user_id: Session.USER.id,
                    created_by: Session.USER.id,
                    updated_by: Session.USER.id,
                });
            };

            /**
             * @param {ORDER_*} by
             */
            $scope.order = function (by) {
                var fields = [],
                    orders = [];

                switch (by) {
                    case ORDER_TIME:
                        fields = ['created_date'];
                        orders = ['desc'];
                        break;

                    case ORDER_USEFULNESS:
                        fields = ['usefulness_score', 'id'];
                        orders = ['desc', 'desc'];
                        break;

                    default:
                        throw new Error('Invalid order option: ' + by);
                }

                $scope.reviews.list = lodash.orderBy(
                    $scope.reviews.list, fields, orders);
            };

            $scope.usefulness_score_line = function (score) {
                return score > 0 ? score : 0;
            };

            $scope.next_page = function () {
                if ($scope.vm.loading || $scope.vm.viewing_all) {
                    return;
                }

                $scope.vm.loading = true;

                Services.query.companies.reviews.view($scope.companyId, Session.USER.id, offset).then(function (reviews) {
                    offset += reviews.length;
                    $scope.vm.loading = false;
                    $scope.vm.viewing_all = !reviews.length;
                    $scope.reviews.list = $scope.reviews.list.concat(reviews);
                });
            };

            Services.query.companies.reviews.view.cache.removeAll();
            Services.query.companies.reviews.summary.cache.removeAll();

            $scope.next_page();
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
                '<div class="reviews-component">',
                '    <chart type="hbar" values="reviews.summary"',
                '        class="margin-bottom-xlarge"',
                '        y-labels=":: vm.chart_labels"></chart>',

                '    <div ng-if="reviews.list.length" class="margin-bottom-medium reviews-component__sort">',
                '        <span class="options--label" i18n="common/sort_by_col"></span>',
                '        <options on-change="order(value)">',
                '            <options-item value="time" selected i18n="review/time"></options-item>',
                '            <options-item value="usefulness" i18n="review/usefulness"></options-item>',
                '        </options>',
                '    </div>',

                '    <section infinite-scroll="next_page()">',
                '        <span ng-repeat="review in reviews.list">',
                '            <review class="margin-top-xlarge" type="view" model="review"></review>',
                '            <h4 class="copy block margin-top-small" i18n="review/did_review_help"',
                '                data="{count: usefulness_score_line(review.usefulness_score)}"></h4>',
                '            <button class="button--thin"',
                '                ng-class="{\'button--unselected\': !review.user_useful_pos}"',
                '                ng-click="useful(review, +1)" i18n="common/yes"></button>',
                '            <button class="button--thin"',
                '                ng-class="{\'button--unselected\': !review.user_useful_neg}"',
                '                ng-click="useful(review, -1)" i18n="common/no"></button>',
                '        </span>',
                '    </section>',
                '</div>'
            ].join('')
        };
    }
]);
