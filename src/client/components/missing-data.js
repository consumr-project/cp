angular.module('tcp').component('missingData', {
    bindings: {},
    template: [
        '<div ng-class="{loading: $ctrl.loading}">',
            '<h1 class="missing-data__title" i18n="company/we_need_data"></h1>',
            '<div class="missing-data__loading loading__only" i18n="common/loading"></div>',
            '<div class="missing-data__item" ',
                'ng-repeat="company in $ctrl.companies" ',
                'ng-click="$ctrl.edit(company)">{{::company.name}}</div>',
        '</div>',
    ].join(''),
    controller: [
        'Services',
        function (Services) {
            'use strict';

            this.loading = null;

            this.init = function () {
                this.loading = true;
                Services.query.companies.missing_data(15)
                    .then(function (companies) {
                        this.companies = companies;
                        this.loading = false;
                    }.bind(this));
            };

            this.edit = function (company) {
                console.log(company);
            };

            this.init();
        }
    ],
});
