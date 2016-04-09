'use strict';

var DataTypes = require('sequelize/lib/data-types');
var config = require('acm');

module.exports = {
    up: function (queryInterface, Sequelize) {
        var User = require(`${process.cwd()}/build/models/user`)
            (queryInterface.sequelize, DataTypes);

        var id = config('seed.root_user_id'),
            name = 'Zaphod Beeblebrox',
            title = 'Big Z',
            avatar_url = 'http://i.imgur.com/0rURPQO.jpg',
            summary = 'It is said that his birth was marked by earthquakes, tidal waves, tornadoes, firestorms, the explosion of three neighbouring stars, and, shortly afterwards, by the issuing of over six and three quarter million writs for damages from all of the major landowners in his Galactic sector. However, the only person by whom this is said is Beeblebrox himself, and there are several possible theories to explain this.';

        return User.update({ name, title, summary, avatar_url }, { where: { id }});
    },

    down: function (queryInterface, Sequelize) {
        var User = require(`${process.cwd()}/src/models/user`)
            (queryInterface.sequelize, DataTypes);

        var id = config('seed.root_user_id'),
            name = '',
            title = '',
            avatar_url = '',
            summary = '';

        return User.update({ name, title, summary, avatar_url }, { where: { id }});
    }
};
