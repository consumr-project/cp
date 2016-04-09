'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('companies', 'wikipedia_url', {
            type: Sequelize.STRING(60)
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('companies', 'wikipedia_url');
    }
};
