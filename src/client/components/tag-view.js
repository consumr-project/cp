angular.module('tcp').component('tagView', {
    bindings: {
        id: '@',
        tag: '=?',
    },
    template: [
        '<h1>{{$ctrl.tag.name}}</h1>',
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
