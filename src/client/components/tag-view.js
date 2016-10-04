angular.module('tcp').component('tagView', {
    bindings: {
        common_companies: '=?',
        common_companies_limit: '=?',
        eventId: '@',
        event_form: '=?',
        event_popover: '=?',
        events_timeline: '=?',
        followed_by_me: '=?',
        id: '@',
        model: '=?',
        related_tags: '=?',
        related_tags_limit: '=?',
        tag: '=?',
    },
    template: (function () {
        'use strict';

        var HTML_PAGE = [
            '<error-view class="forced-full-span" ng-if="$ctrl.tag === false"></error-view>',
            '<section class="site-content--main" ng-if="$ctrl.tag">',
            '    <table class="full-span">',
            '        <tr>',
            '            <td>',
            '                <h1 class="take-space inline-block animated fadeIn">{{$ctrl.tag.name}}</h1>',
            '            </td>',
            '            <td class="right-align">',
            '                <button class="logged-in-only button--unselected animated fadeIn"',
            '                    ng-click="$ctrl.on_start_following($ctrl.tag.id)"',
            '                    ng-if="$ctrl.followed_by_me === false" i18n="admin/follow"></button>',
            '                <button class="logged-in-only animated fadeIn"',
            '                    ng-click="$ctrl.on_stop_following($ctrl.tag.id)"',
            '                    ng-if="$ctrl.followed_by_me === true" i18n="admin/unfollow"></button>',
            '            </td>',
            '        </tr>',
            '    </table>',
            '    <hr>',

            '    <timeline class="component__timeline"',
            '        api="$ctrl.events_timeline"',
            '        on-add="$ctrl.event_popover.show()"',
            '        parent="tags"',
            '        event-id="{{$ctrl.eventId}}"',
            '        id="{{$ctrl.id}}"></timeline>',

            '        <popover with-close-x with-backdrop api="$ctrl.event_popover" class="popover--with-content">',
            '            <event',
            '                api="$ctrl.event_form"',
            '                on-save="$ctrl.events_timeline.refresh(); $ctrl.event_popover.hide(); $ctrl.event_form.reset()"',
            '                on-cancel="$ctrl.event_form.reset(); $ctrl.event_popover.hide()"',
            '                tied-to="{tags: [$ctrl.tag]}"',
            '            ></event>',
            '        </popover>',
            '</section>',

            '<section class="site-content--aside" ng-if="$ctrl.tag">',
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
        ].join('');

        var HTML_VIEW = [
            '<h2>{{$ctrl.model.label}}</h2>',
        ].join('');

        return ['$attrs', function ($attrs) {
            switch ($attrs.type) {
                case 'view': return HTML_VIEW;
                default: return HTML_PAGE;
            }
        }];
    })(),
    controller: ['RUNTIME', 'Navigation', 'Services', 'Session', 'utils', function (RUNTIME, Navigation, Services, Session, utils) {
        'use strict';

        this.common_companies_limit = 5;
        this.related_tags_limit = 5;
        this.followed_by_me = null;

        this.nav = Navigation;
        this.event_form = {};
        this.event_popover = {};
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

            Services.query.tags.retrieve(id, ['followers']).then(function (tag) {
                if (tag) {
                    this.tag = tag;
                    this.tag.name = tag[RUNTIME.locale];
                    this.followed_by_me = tag.followers['@meta'].instead.includes_me;
                } else {
                    this.tag = false;
                }
            }.bind(this))
                .catch(function () {
                    this.tag = false;
                }.bind(this));
        };

        this.show_more_related_tags = function () {
            this.related_tags_limit += 5;
        };

        this.show_more_common_companies = function () {
            this.common_companies_limit += 5;
        };

        this.on_stop_following = function (tag_id) {
            utils.assert(tag_id);
            utils.assert(Session.USER, 'must be logged in');
            utils.assert(Session.USER.id, 'must be logged in');

            return Services.query.tags.followers.delete(tag_id, Session.USER.id)
                .then(utils.scope.set(this, 'followed_by_me', false));
        };

        this.on_start_following = function (tag_id) {
            utils.assert(tag_id);
            utils.assert(Session.USER, 'must be logged in');
            utils.assert(Session.USER.id, 'must be logged in');

            return Services.query.tags.followers.upsert(tag_id, {
                user_id: Session.USER.id
            }).then(utils.scope.set(this, 'followed_by_me', true));
        };

        this.init = function () {
            if (this.id) {
                this.load(this.id);
            }
        };

        this.init();
    }],
});
