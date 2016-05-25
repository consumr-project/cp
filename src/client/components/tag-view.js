angular.module('tcp').component('tagView', {
    bindings: {
        common_companies: '=?',
        common_companies_limit: '=?',
        events_timeline: '=?',
        id: '@',
        related_tags: '=?',
        related_tags_limit: '=?',
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
                                        /* XXX */
        '                <button class="hidden xx-logged-in-only button--unselected"',
        '                    ng-click="toggle_follow($ctrl.tag.id)"',
        '                    i18n="admin/follow"></button>',
        '            </td>',
        '        </tr>',
        '    </table>',
        '    <hr>',

        '    <div class="margin-top-xlarge margin-bottom-medium center-align">',
                                /* XXX */
        '        <button class="hidden xx-logged-in-only" ng-click="vm.add_event.show()" i18n="event/add"></button>',
        '    </div>',
        '    <events class="component__events"',
        '        api="events_timeline"',
        '        parent="tags"',
        '        id="{{$ctrl.id}}"></events>',
        '</section>',

        '<section class="site-content--aside">',
        '    <div class="site-content--aside__section">',
        '        <h3 class="margin-bottom-medium" i18n="tag/common_companies"></h3>',
        '        <tag ng-click="$ctrl.nav.company_by_id(comp.id)" class="keyword" label="{{::comp.label}}"',
        '            ng-repeat="comp in $ctrl.common_companies | limitTo: $ctrl.common_companies_limit"></tag>',
        '        <i ng-if="!$ctrl.common_companies.length" i18n="common/none"></i>',
        '        <h5 ng-click="$ctrl.show_more_common_companies()" class="margin-top-xsmall a--action"',
        '            ng-if="$ctrl.common_companies.length && $ctrl.common_companies.length > $ctrl.common_companies_limit"',
        '            i18n="common/show_more"></h5>',
        '    </div>',
        '    <div class="site-content--aside__section">',
        '        <h3 class="margin-bottom-medium" i18n="tag/related_tags"></h3>',
        '        <tag ng-click="$ctrl.nav.tag(tag.id)" class="keyword" label="{{::tag.label}}"',
        '            ng-repeat="tag in $ctrl.related_tags | limitTo: $ctrl.related_tags_limit"></tag>',
        '        <i ng-if="!$ctrl.related_tags.length" i18n="common/none"></i>',
        '        <h5 ng-click="$ctrl.show_more_related_tags()" class="margin-top-xsmall a--action"',
        '            ng-if="$ctrl.rela.length && $ctrl.related_tags.length > $ctrl.related_tags_limit"',
        '            i18n="common/show_more"></h5>',
        '    </div>',
        '</section>',
    ].join(''),
    controller: ['RUNTIME', 'Navigation', 'Services', function (RUNTIME, Navigation, Services) {
        'use strict';

        this.common_companies_limit = 5;
        this.related_tags_limit = 5;

        this.nav = Navigation;
        this.events_timeline = {};

        /**
         * @param {String} id
         * @return {void}
         */
        this.load = function (id) {
            Services.query.tags.common.companies(id).then(function (companies) {
                this.common_companies = companies;
            }.bind(this));

            Services.query.tags.common.tags(id).then(function (tags) {
                this.related_tags = tags;
            }.bind(this));

            Services.query.tags.retrieve(id).then(function (tag) {
                this.tag = tag;
                this.tag.name = tag[RUNTIME.locale];
            }.bind(this));
        };

        this.show_more_related_tags = function () {
            this.related_tags_limit += 5;
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
