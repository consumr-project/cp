angular.module('tcp').component('adminView', {
    bindings: {
        beta_email_invites: '=?',
        email_filter: '=?',
        selection: '=?',
    },
    template: [
        '<snav value="$ctrl.selection" class="snav--borderless">',
        '    <snav-item',
        '        value="beta_email_invites"',
        '        ng-click="$ctrl.select_section(\'beta_email_invites\')"',
        '        i18n="admin/beta_email_invites">',
        '    </snav-item>',
        '</snav>',

        '<section class="margin-top-xlarge">',
        '    <input class="full-span"',
        '        ng-model="$ctrl.email_filter"',
        '        i18n="common/search_or_create"',
        '        prop="placeholder"',
        '    />',
        '    <button class="margin-top-small"',
        '        ng-click="$ctrl.add($ctrl.email_filter)"',
        '        i18n="common/add"></button>',
        '</section>',

        '<section class="margin-top-medium">',
        '    <div ng-repeat="email in $ctrl.beta_email_invites | filter:$ctrl.email_filter"',
        '        class="beta-email-invite">',
        '        <span>{{::email.email}}</span>',
        '        <span class="beta-email-invite__approved"',
        '            ng-if="email.approved"',
        '            prop="html"',
        '            i18n="admin/approved_by_on"',
        '            data="{',
        '                id: email.approved_by_id,',
        '                name: email.approved_by_name,',
        '                date: email.approved_date,',
        '            }">',
        '        </span>',
        '        <button',
        '            class="beta-email-invite__approve button--slim button--link"',
        '            ng-if="!email.approved"',
        '            ng-click="$ctrl.approve(email)"',
        '            i18n="admin/approve"',
        '        >',
        '        </button>',
        '    </div>',
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

            this.selection = 'beta_email_invites';

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
                stamp_approval(email);
            };

            /**
             * @param {string} email
             */
            this.add = function (email) {
                var model = { email: email };
                stamp_approval(model);
                this.beta_email_invites.unshift(model);
                this.email_filter = '';
            };

            this.init = function () {
                Services.query.admin.beta_email_invites.retrieve()
                    .then(utils.scope.set(this, 'beta_email_invites'));
            };

            this.init();
        }
    ],
});
