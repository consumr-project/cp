angular.module('tcp').component('siteStats', {
    template: [
        '<div>',
            '<stat-box ng-repeat="(obj, count) in $ctrl.stats" ',
                'label="{{obj}}" ',
                'value="{{count}}"></stat-box>',
        '</div>',
    ].join(''),
    controller: [
        'Services',
        'utils2',
        function (Services, utils2) {
            'use strict';

            this.$onInit = function () {
                Services.query.admin.site_stats()
                    .then(utils2.curr_set(this, 'stats'))
            };
        }
    ],
});
