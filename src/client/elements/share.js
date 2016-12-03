/**
 * @attribute model {ShareModel}
 *
 * interface ShareModel {
 *     text: string;
 *     url: string;
 * }
 */
angular.module('tcp').component('share', {
    bindings: {
        model: '=?'
    },
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
                '<popover-item ng-click="$ctrl.share_twitter()">',
                    '<div class="share__twitter"></div>',
                '</popover-item>',
                '<popover-item ng-click="$ctrl.share_facebook()">',
                    '<div class="share__facebook"></div>',
                '</popover-item>',
                '<popover-item ng-click="$ctrl.share_linkedin()">',
                    '<div class="share__linkedin"></div>',
                '</popover-item>',
            '</popover>',
        '</span>',
    ].join(''),
    controller: ['lodash', function (lodash) {
        'use strict';

        var URL_TWITTER = 'https://twitter.com/intent/tweet?via=consumrproject';

        /**
         * @param {Object} overrides
         * @return {string}
         */
        function win_opt(overrides) {
            return lodash.reduce(lodash.merge({
                menubar: 'no',
                location: 'yes',
                resizable: 'yes',
                scrollbars: 'yes',
                status: 'no',
                height: '800',
                width: '800',
                left: '100',
            }, overrides), function (opts, val, opt) {
                opts.push(opt + '=' + val);
                return opts;
            }, []).join(',');
        }

        /**
         * @param {string} provider
         * @return {string}
         */
        function win_name(provider) {
            return 'cp_share_' + provider;
        }

        this.menu = {
            show: false
        };

        this.share_facebook = function () {
        };

        this.share_linkedin = function () {
        };

        this.share_twitter = function () {
            var url = URL_TWITTER +
                '&url=' + encodeURI(this.model.url) +
                '&text=' + encodeURI(this.model.text);

            window.open(url, win_name('twitter'), win_opt({
                height: 250,
                width: 800,
            }));
        };
    }],
});
