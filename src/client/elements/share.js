/**
 */
angular.module('tcp').component('share', {
    bindings: {},
    template: [
        '<span>',
            '<span data-share-anchor ',
                'ng-click="$ctrl.menu.show = true" ',
                'i18n="admin/share" ',
                'class="no-outline uppercase bold font-size-small">',
            '</span>',
            '<popover class="left-align" ',
                'anchored ',
                'anchored-element="\'[data-share-anchor]\'" ',
                'anchored-show="$ctrl.menu.show" ',
                'anchored-placement="bottom-right" ',
                'anchored-top-offset="10" ',
                'anchored-left-offset="10" ',
                'anchored-arrow="true" ',
                'anchored-auto-hide="true">',
                '<popover-item>',
                    '<div class="share__twitter"></div>',
                '</popover-item>',
                '<popover-item>',
                    '<div class="share__facebook"></div>',
                '</popover-item>',
                '<popover-item>',
                    '<div class="share__linkedin"></div>',
                '</popover-item>',
            '</popover>',
        '</span>',
    ].join(''),
    controller: [function () {
        'use strict';

        this.menu = {
            show: false
        };
    }],
});
