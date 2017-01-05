angular.module('tcp').component('adminView', {
    bindings: {},
    template: [
        '<snav value="$ctrl.selection" class="snav--borderless">',
            '<snav-item ',
                'value="stats" ',
                'ng-click="$ctrl.select_section(\'stats\')" ',
                'i18n="admin/stats">',
            '</snav-item>',
            '<snav-item ',
                'value="beta_email_invites" ',
                'ng-click="$ctrl.select_section(\'beta_email_invites\')" ',
                'i18n="admin/beta_email_invites">',
            '</snav-item>',
        '</snav>',

        '<site-stats ',
            'ng-if="$ctrl.selection === \'stats\'" ',
            'class="block margin-top-xlarge" ',
        '></site-stats>',

        '<section class="margin-top-xlarge" ng-if="$ctrl.selection === \'beta_email_invites\'">',
        '    <section>',
        '        <message closable ng-if="$ctrl.error_view" type="error">',
        '            <span ng-if="$ctrl.error_view === $ctrl.ERROR_STD" i18n="common/error_loading"></span>',
        '            <span ng-if="$ctrl.error_view === $ctrl.ERROR_UNIQUE" i18n="admin/error_unique_email"></span>',
        '            <span ng-if="$ctrl.error_view === $ctrl.ERROR_REQ_EMAIL" i18n="admin/error_email_required"></span>',
        '        </message>',
        '        <input class="full-span margin-top-small"',
        '            ng-model="$ctrl.email_filter"',
        '            ng-class="{\'loading--spinner\': $ctrl.loading_add}"',
        '            i18n="common/search_or_create"',
        '            prop="placeholder"',
        '        />',
        '        <button class="margin-top-small"',
        '            ng-disabled="$ctrl.loading_add"',
        '            ng-click="$ctrl.add($ctrl.email_filter)"',
        '            i18n="common/add"></button>',
        '    </section>',

        '    <section class="margin-top-medium">',
        '        <div ng-repeat="email in $ctrl.beta_email_invites | filter:$ctrl.email_filter"',
        '            ng-class="{loading: email.$loading}"',
        '            class="beta-email-invite can-load">',
        '            <span>{{::email.email}}</span>',
        '            <span class="beta-email-invite__approved"',
        '                ng-if="email.approved"',
        '                prop="html"',
        '                i18n="admin/approved_by_on"',
        '                data="{',
        '                    id: email.approved_by_id,',
        '                    name: email.approved_by_name,',
        '                    date: email.approved_date,',
        '                }">',
        '            </span>',
        '            <button',
        '                class="beta-email-invite__approve button--slim button--link"',
        '                ng-disabled="email.$loading"',
        '                ng-if="!email.approved"',
        '                ng-click="$ctrl.approve(email)"',
        '                i18n="admin/approve"',
        '            >',
        '            </button>',
        '        </div>',
        '    </section>',
        '</section>',
    ].join(''),
    controller: [
        'CONFIG',
        'Services',
        'Session',
        '$window',
        'utils',
        function (CONFIG, Services, Session, $window, utils) {
            'use strict';

            this.ERROR_STD = 'errstd';
            this.ERROR_UNIQUE = 'errunique';
            this.ERROR_REQ_EMAIL = 'errreqemail';

            this.selection = 'stats';
            this.error_view = null;

            /**
             * @param {BetaEmailInviteView} email
             */
            function stamp_approval(email) {
                email.approved = true;
                email.approved_by_id = Session.USER.id;
                email.approved_by_name = Session.USER.name;
                email.approved_date = new Date();
            }

            /**
             * @param {string} section
             */
            this.select_section = function (section) {
                this.selection = section;
            };

            /**
             * @param {BetaEmailInviteView} email
             */
            this.approve = function (email) {
                utils.assert(email);
                utils.assert(email.email);

                email.$loading = true;
                this.error_view = null;

                Services.query.admin.beta_email_invites.approve(email.email)
                    .then(function () {
                        stamp_approval(email);
                        email.$loading = false;
                    })
                    .catch(function () {
                        this.error_view = this.ERROR_STD;
                    }.bind(this));
            };

            /**
             * @param {string} email
             */
            this.add = function (email) {
                var model = { email: email };

                this.error_view = this.ERROR_REQ_EMAIL;
                utils.assert(email);
                this.error_view = null;

                this.loading_add = true;

                Services.query.admin.beta_email_invites.create_approved(email)
                    .then(function () {
                        stamp_approval(model);
                        this.beta_email_invites.unshift(model);
                        this.loading_add = false;
                        this.email_filter = '';
                    }.bind(this))
                    .catch(function (resp) {
                        this.loading_add = false;

                        switch (resp.status) {
                            case 409:
                                this.error_view = this.ERROR_UNIQUE;
                                break;

                            default:
                                this.error_view = this.ERROR_STD;
                                break;
                        }
                    }.bind(this));
            };

            this.init = function () {
                Services.query.admin.beta_email_invites.retrieve()
                    .then(utils.scope.set(this, 'beta_email_invites'))
                    .catch(utils.scope.set(this, 'error_view', this.ERROR_STD));
            };

            this.init();
        }
    ],
});
