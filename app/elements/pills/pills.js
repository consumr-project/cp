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
     * get an attribute overwrite
     * @param {Object} config
     * @param {String} label
     * @return {String}
     */
    function attr(config, label) {
        return config[label + 'Attr'] || label;
    }

    /**
     * @param {Object[]} selections
     * @param {Object} config
     * @return {Object[]}
     */
    function normalize(selections, config) {
        var labelAttr = attr(config, 'label'),
            typeAttr = attr(config, 'type'),
            idAttr = attr(config, 'id');

        return _.map(selections, function (selection) {
            return {
                id: selection[idAttr],
                type: selection[typeAttr],
                label: selection[labelAttr]
            };
        });
    }

    /**
     * @param {Object[]} selections
     * @param {String} id
     * @param {Object} config
     * @return {Object[]}
     */
    function without(selections, id, config) {
        return _.without(selections,
            _.find(selections,
                _.zipObject([[attr(config, 'id'), id]])));
    }

    /**
     * @param {angular.Scope} $scope
     * @param {angular.Attributes} $attrs
     * @param {jQuery} $input field
     * @param {jQuery.Event} $ev
     */
    function command($scope, $attrs, $input, $ev) {
        var data = $ev.target.dataset.pillsData;

        switch ($ev.target.dataset.pillsRole) {
            case ROLE_REMOVE:
                console.log('removing %s', data);
                $scope.selections = without($scope.selections, data, $attrs);
                break;

            case ROLE_SELECT:
                console.log('selecting %s', data);
                break;

            default:
                $input.focus();
                break;
        }
    }

    /**
     * @param {angular.Scope} $scope
     * @param {angular.Attributes} $attrs
     * @param {jQuery} $input field
     * @param {jQuery.Event} $ev
     */
    function query($scope, $attrs, $input, $ev) {
        if ($input.data('pillsLastValue') === $ev.target.value) {
            return;
        }

        $input.data('pillsLastValue', $ev.target.value);
        $input.addClass('loading');

        $scope.query($ev.target.value, function (err, options) {
            $scope.options = normalize(options, $attrs);
            $scope.$apply();
            $input.removeClass('loading');
        });
    }

    function controller($scope, $attrs) {
        $scope.$watchCollection('selections', function (selections) {
            $scope.pills = normalize(selections, $attrs);
        });
    }

    function link($scope, $elem, $attrs) {
        var $input = $elem.find('input');
        $elem.click(command.bind(null, $scope, $attrs, $input));
        $input.keyup(_.debounce(query.bind(null, $scope, $attrs, $input), 100));
    }

    return {
        replace: true,
        template: [
            '<div class="pills-container is-non-selectable">',
// XXX
// '<pre>{{selections | json}}</pre>',
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
                    '<input class="pills-element__input no-interaction" />',
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
        scope: { selections: '=', query: '&', },
        controller: ['$scope', '$attrs', controller],
        link: link
    };
}]);
