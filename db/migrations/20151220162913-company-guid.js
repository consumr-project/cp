'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('companies', 'guid', {
            type: Sequelize.STRING
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('companies', 'guid');
    }
};
