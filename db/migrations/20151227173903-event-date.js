'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('events', 'date', {
            type: Sequelize.DATE
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('events', 'date');
    }
};
