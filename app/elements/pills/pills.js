/**
 * @attribute {Object[]} selections
 * @attribute {String} labelAttr attribute to use in selections to get labels
 * @attribute {String} idAttr attribute to use in selections to get ids
 * @attribute {String} typeAttr attribute to use in selections to get types
 */
angular.module('tcp').directive('pills', ['lodash', function (_) {
    'use strict';

    var ROLE_REMOVE = 'remove',
        ROLE_SELECT = 'select';

    /**
     * @param {Object[]} selections
     * @param {$attrs} attrs
     * @return {Object[]}
     */
    function normalize(selections, attrs) {
        var labelAttr = attrs.labelAttr || 'label',
            typeAttr = attrs.typeAttr || 'type',
            idAttr = attrs.idAttr || 'id';

        return _.map(selections, function (selection) {
            return {
                id: selection[idAttr],
                type: selection[typeAttr],
                label: selection[labelAttr]
            };
        });
    }

    function link(scope, elem, attrs) {
        var $input = elem.find('input');

        // XXX
        scope.selections = [
            { label: 'Marcos', id: 1 },
            { label: 'Laura', id: 2 },
            { label: 'Aryel', id: 3 },
        ];

        scope.pills = normalize(scope.selections, attrs);
        scope.options = normalize(scope.selections, attrs);

        elem.click(function (ev) {
            var data = ev.target.dataset.pillsData;

            switch (ev.target.dataset.pillsRole) {
                case ROLE_REMOVE:
                    console.log('removing %s', data);
                    break;

                case ROLE_SELECT:
                    console.log('selecting %s', data);
                    break;

                default:
                    $input.focus();
                    break;
            }
        });

        $input.keyup(function (ev) {
        });
    }

    return {
        replace: true,
        template: [
            '<div class="pills-container">',
                '<div class="pills-element">',
                    '<div class="pills-element__selections">',
                        '<div ',
                            'class="pills-element__pill" ',
                            'ng-repeat="pill in pills" ',
                            'data-pill-id="{{::pill.id}}" ',
                            'data-pill-type="{{::pill.type}}"',
                        '>',
                            '<span class="pills-element__pill__label">{{::pill.label}}</span>',
                            '<span data-pills-role="remove" data-pills-data="{{::pill.id}}" ',
                                'class="pills-element__pill__remove"></span>',
                        '</div>',
                    '</div>',
                    '<input class="pills-element__input" />',
                '</div>',
                '<div class="pills-results">',
                    '<div ',
                        'class="pills-results__option" ',
                        'ng-repeat="option in options" ',
                        'data-pills-role="select" ',
                        'data-pills-data="{{::option.id}}" ',
                        'data-option-type="{{::option.type}}"',
                    '>{{::option.label}}</div>',
                '</div>',
            '</div>'
        ].join(''),
        scope: { selections: '=' },
        link: link
    };
}]);
