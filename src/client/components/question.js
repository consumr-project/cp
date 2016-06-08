angular.module('tcp').component('question', {
    bindings: {
        model: '=?',
    },
    template: [
        '<div>',
        '    <h2>{{::$ctrl.model.title}}</h2>',
        '    <h4 i18n date="{{::$ctrl.model.created_date}}" format="D MMM, YYYY" class="margin-top-xsmall"></h4>',
        '    <p ng-if="::$ctrl.model.answer">{{::$ctrl.model.answer}}</p>',
        '</div>',
    ].join(''),
    controller: [function () {
        'use strict';
    }],
});
