angular.module('tcp').directive('homeView', [
    function () {
        'use strict';

        return {
            replace: true,
            template: function () {
                var style = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                return [
                    '<div style="margin-top: -23px">',
                    '    <div class="banner banner--' + style + '">',
                    '        <div class="site-content center-align">',
                    '            <search form="true"></search>',
                    '            <p i18n="common/intro"></p>',
                    '        </div>',
                    '    </div>',

                    '    <div class="snav__item snav__item--active" i18n="home/trending"></div>',
                    '    <hr>',
                    '    <trending class="margin-top-large site-content"></trending>',
                    '</div>',
                ].join('');
            },
        };
    }
]);
