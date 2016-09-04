angular.module('tcp').component('adminView', {
    bindings: {
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
    ].join(''),
    controller: ['CONFIG', 'Services', 'Session', function (CONFIG, Services, Session) {
        'use strict';

        this.selection = 'beta_email_invites';

        this.select_section = function (section) {
            this.selection = section;
        };
    }],
});
