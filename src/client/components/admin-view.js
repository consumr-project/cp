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
        '    <input ng-model="$ctrl.email_filter" />',
        '</section>',

        '<section class="margin-top-small">',
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
        function (CONFIG, Services, Session, $window) {
            'use strict';

            this.selection = 'beta_email_invites';

            this.select_section = function (section) {
                this.selection = section;
            };

            /**
             * @param {BetaEmailInviteView} email
             */
            this.approve = function (email) {
                email.approved = true;
                email.approved_by_id = Session.USER.id;
                email.approved_by_name = Session.USER.name;
                email.approved_date = new Date();
            };

            this.init = function () {
                Services.query.admin.beta_email_invites.retrieve().then(function (emails) {
                    this.beta_email_invites = emails;
                }.bind(this));
            };

            this.init();
        }
    ],
});
