'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('companies', 'wikipedia_page_id');
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('companies', 'wikipedia_page_id', {
            type: Sequelize.STRING
        });
    }
};
