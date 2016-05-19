angular.module('tcp').component('tagView', {
    bindings: {
        id: '@',
        common_companies_limit: '=?',
        common_companies: '=?',
        tag: '=?',
    },
    template: [
        '<section class="site-content--main">',
        '    <table class="full-span">',
        '        <tr>',
        '            <td>',
        '                <h1 class="take-space inline-block">{{$ctrl.tag.name}}</h1>',
        '            </td>',
        '            <td class="right-align">',
        '                <button class="logged-in-only button--unselected"',
        '                    ng-click="toggle_follow($ctrl.tag.id)"',
        '                    i18n="admin/follow"></button>',
        '            </td>',
        '        </tr>',
        '    </table>',
        '</section>',
        '<section class="site-content--aside">',
        '    <div class="site-content--aside__section">',
        '        <h3 class="margin-bottom-medium" i18n="tag/common_companies"></h3>',
        '        <tag ng-click="$ctrl.go_to_company(comp)" class="keyword" label="{{::comp.label}}"',
        '            ng-repeat="comp in $ctrl.common_companies | limitTo: $ctrl.common_companies_limit"></tag>',
        '        <i ng-if="!$ctrl.common_companies.length" i18n="common/none"></i>',
        '        <h5 ng-click="$ctrl.show_more_common_companies()" class="margin-top-xsmall a--action"',
        '            ng-if="$ctrl.common_companies.length && $ctrl.common_companies.length > $ctrl.common_companies_limit"',
        '            i18n="common/show_more"></h5>',
        '    </div>',
        '    <div class="site-content--aside__section">',
        '        <h3 class="margin-bottom-medium" i18n="tag/related_tags"></h3>',
        '        <i i18n="common/none"></i>',
        '    </div>',
        '</section>',
    ].join(''),
    controller: ['RUNTIME', 'Navigation', 'Services', function (RUNTIME, Navigation, Services) {
        'use strict';

        this.common_companies_limit = 5;

        /**
         * @param {String} id
         * @return {void}
         */
        this.load = function (id) {
            Services.query.tags.common.companies(id).then(function (companies) {
                this.common_companies = companies;
            }.bind(this));

            Services.query.tags.retrieve(id).then(function (tag) {
                this.tag = tag;
                this.tag.name = tag[RUNTIME.locale];
            }.bind(this));
        };

        /**
         * @param {Company} company
         * @return {void}
         */
        this.go_to_company = function (company) {
            Navigation.company_by_id(company.id);
        };

        this.show_more_common_companies = function () {
            this.common_companies_limit += 5;
        };

        this.init = function () {
            if (this.id) {
                this.load(this.id);
            }
        };

        this.init();
    }],
});
