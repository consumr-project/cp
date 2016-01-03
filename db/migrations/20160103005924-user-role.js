'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('users', 'role', {
            type: Sequelize.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('users', 'role');
    }
};
