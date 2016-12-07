angular.module('tcp').component('compliments', {
    bindings: {
        api: '=?'
    },
    template: [
        '<popover with-close-x class="popover--fullscreen" api="$ctrl.popover">',
            '<div class="site-content site-content--slim-100 site-content--no-header center-align">',
                '<h1 class="italic">{{$ctrl.message}}</h1>',
                '<img ng-src="/assets/images/{{$ctrl.image}}.svg" />',
                '<button i18n="common/thanks_keep_going" ',
                    'ng-click="$ctrl.hide()"></button>',
                '<button i18n="common/enough_stop_now" ',
                    'ng-click="$ctrl.hide_and_stop()" ',
                    'class="button--link"></button>',
            '</div>',
        '</popover>',
    ].join(''),
    controller: [
        'i18n',
        function (i18n) {
            'use strict';

            var KEY = 'cp:no_compliments';

            var IMAGES = [
                'doughnut',
                'popsicle',
            ];

            var STRINGS = i18n.strings && 'compliments' in i18n.strings ?
                Object.keys(i18n.strings.compliments) :
                Object.keys(i18n.def_strings.compliments);

            this.image = null;
            this.message = null;

            // filled in by popover component
            this.popover = {};

            this.hide = function () {
                this.popover.hide();
            };

            this.hide_and_stop = function () {
                this.hide();
                localStorage.setItem(KEY, '1');
            };

            /**
             * @param {T[]} arr
             * @return {T}
             */
            function rand(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }

            /**
             * @return {boolean}
             */
            function allowed() {
                return localStorage.getItem(KEY) !== '1';
            }

            if (this.api) {
                this.api.allowed = allowed;
                this.api.hide = this.hide.bind(this);

                this.api.show = function () {
                    if (allowed()) {
                        this.image = rand(IMAGES);
                        this.message = i18n.get('compliments/' + rand(STRINGS));
                        this.popover.show();
                    }
                }.bind(this);
            }
        }
    ],
});
