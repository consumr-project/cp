angular.module('tcp').component('compliments', {
    bindings: {},
    template: [
        '<popover class="popover--fullscreen" api="$ctrl.popover">',
            '<div class="site-content site-content--slim-100 site-content--no-header center-align">',
                '<h1 class="italic">{{$ctrl.message}}</h1>',
                '<img ng-src="/assets/images/{{$ctrl.image}}.svg" />',
            '</div>',
        '</popover>',
    ].join(''),
    controller: [
        'i18n',
        '$interval',
        function (i18n, $interval) {
            'use strict';

            var IMAGES = [
                'doughnut',
                'popsicle',
            ];

            var STRINGS = i18n.strings && 'compliments' in i18n.strings ?
                Object.keys(i18n.strings.compliments) :
                Object.keys(i18n.def_strings.compliments);

            // filled in by popover component
            this.popover = {};
            this.image = null;
            this.message = null;

            $interval(function () {
                this.image = rand(IMAGES);
                this.message = i18n.get('compliments/' + rand(STRINGS));
                this.popover.show();
            }.bind(this), 3000);

            /**
             * @param {T[]} arr
             * @return {T}
             */
            function rand(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
        }
    ],
});
