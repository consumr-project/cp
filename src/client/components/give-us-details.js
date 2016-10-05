angular.module('tcp').component('giveUsDetails', {
    bindings: {
        companies: '=?',
    },
    template: [
        '<div ng-show="$ctrl.enabled && $ctrl.companies.length">',
        '    <div ng-repeat="company in $ctrl.companies" class="margin-bottom-small">',
        '        <p class="not-half-width-but-not-full-either bold"',
        '            i18n="company/new_company_more_info"',
        '            data="{ name: company.name }"></p>',
        '        <br>',

        '        <button ng-click="$ctrl.yes(company)" i18n="common/sure"></button>',
        '        <button ng-click="$ctrl.nah(company)" i18n="common/no_thanks"',
        '            class="button--unselected"></button>',
        '    </div>',
        '</div>',
    ].join(''),
    controller: ['Navigation', 'Feature', 'lodash', function (Navigation, Feature, lodash) {
        'use strict';

        this.enabled = Feature.on('mind_giving_company_details');
        this.companies = lodash.cloneDeep(this.companies);

        this.nah = function (company) {
            this.companies = lodash.without(this.companies, company);
        };

        this.yes = function (company) {
            Navigation.company_edit(company.id);
        };
    }],
});
