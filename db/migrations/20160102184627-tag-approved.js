'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('tags', 'approved', {
            type: Sequelize.BOOLEAN
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('tags', 'approved');
    }
};
