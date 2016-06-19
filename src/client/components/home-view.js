angular.module('tcp').directive('homeView', [
    function () {
        'use strict';

        return {
            replace: true,
            template: function () {
                var style = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                return [
                    '<div class="home-view-component">',
                    '    <div class="banner banner--' + style + '">',
                    '        <div class="site-content center-align">',
                    '            <search form="true"></search>',
                    '            <p i18n="common/intro"></p>',
                    '        </div>',
                    '    </div>',

                    '    <section class="margin-top-large">',
                    '        <div class="snav__item snav__item--active margin-left-xlarge" i18n="home/trending"></div>',
                    '        <hr>',

                    '        <trending></trending>',

                    '        <div class="home-view-component__coooool">',
                    '            <p i18n="home/have_a_sec"></p>',
                    '            <p i18n="home/do_something_cool"></p>',
                    '            <button i18n="home/im_cool"></button>',
                    '        </div>',
                    '    </section>',
                    '</div>',
                ].join('');
            },
        };
    }
]);
