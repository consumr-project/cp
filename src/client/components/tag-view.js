angular.module('tcp').component('tagView', {
    bindings: {
        id: '@',
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
        '        <i i18n="common/none"></i>',
        '    </div>',
        '    <div class="site-content--aside__section">',
        '        <h3 class="margin-bottom-medium" i18n="tag/related_tags"></h3>',
        '        <i i18n="common/none"></i>',
        '    </div>',
        '</section>',
    ].join(''),
    controller: ['RUNTIME', 'Services', function (RUNTIME, Services) {
        'use strict';

        /**
         * @param {String} id
         * @return {Promise<Tag>}
         */
        this.load = function (id) {
            return Services.query.tags.retrieve(id).then(function (tag) {
                this.tag = tag;
                this.tag.name = tag[RUNTIME.locale];
            }.bind(this));
        };

        this.init = function () {
            if (this.id) {
                this.load(this.id);
            }
        };

        this.init();
    }],
});
