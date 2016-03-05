'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('events', 'logo', {
            type: Sequelize.STRING
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('events', 'logo');
    }
};
