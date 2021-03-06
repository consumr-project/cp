angular.module('tcp').component('missingData', {
    bindings: {},
    template: [
        '<div ng-class="{loading: $ctrl.loading, \'missing-data--active\': $ctrl.selected}">',
            '<p ng-if="$ctrl.allowed" class="missing-data__title" i18n="company/we_need_data"></p>',
            '<message ng-if="!$ctrl.allowed" type="error" i18n="admin/error_login_to_do_this"></message>',
            '<compliments api="$ctrl.compliment"></compliments>',
            '<div class="missing-data__loading loading__only" i18n="common/loading"></div>',
            '<div ng-repeat="company in $ctrl.companies">',
                '<div class="missing-data__item" ',
                    'ng-click="$ctrl.edit(company)">{{::company.name}}</div>',
                '<company type="edit" ',
                    'class="animated fadeIn" ',
                    'on-saved="$ctrl.saved(company)" ',
                    'on-cancel="$ctrl.cancel()" ',
                    'ng-if="$ctrl.selected === company" ',
                    'model="company"></company>',
            '</div',
        '</div>',
    ].join(''),
    controller: [
        'Services',
        'Session',
        'lodash',
        '$timeout',
        function (Services, Session, lodash, $timeout) {
            'use strict';

            var done_counter = 0;

            this.loading = null;
            this.allowed = null;
            this.selected = null;
            this.companies = [];

            // filled in by compliments component
            this.compliment = {};

            this.init = function () {
                this.loading = true;
                Services.query.companies.missing_data(15)
                    .then(function (companies) {
                        this.companies = companies;
                        this.loading = false;
                    }.bind(this));
            };

            this.cancel = function () {
                this.selected = null;
            };

            this.saved = function (company) {
                this.companies = lodash.without(this.companies, company);
                this.selected = null;

                $timeout(function () {
                    if (done_counter++ % 5 === 0) {
                        this.compliment.show();
                    }
                }.bind(this), 150);
            };

            this.edit = function (company) {
                if (this.selected === company) {
                    this.selected = null;
                } else {
                    this.selected = company;
                }
            };

            if (!Session.USER || !Session.USER.id) {
                this.allowed = false;
            } else {
                this.allowed = true;
                this.init();
            }
        }
    ],
});
