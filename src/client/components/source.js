angular.module('tcp').directive('source', [
    function () {
        'use strict';

        var HTML_VIEW = [
            '<div class="source source--view line-separated">',
            '    <a target="_blank" rel="noreferrer" href="{{::model.url}}">{{::model.url}}</a>',
            '    <h4 i18n date="{{::model.published_date}}" format="D MMM, YYYY" class="margin-top-small"></h4>',
            '    <p>{{::model.summary}}</p>',
            '</div>',
        ].join('');

        return {
            replace: true,
            template: HTML_VIEW,
            scope: {
                model: '=',
            },
        };
    }
]);
