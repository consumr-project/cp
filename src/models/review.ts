import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize),
        Company = require('./company')(sequelize);

    var Review = sequelize.define('review', merge(TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        company_id: {
            type: Type.UUID,
            allowNull: true
        },

        score: {
            type: Type.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
            },
        },

        title: {
            type: Type.STRING
        },

        summary: {
            type: Type.TEXT
        },
    }), CONFIG);

    Review.belongsTo(User);
    Review.belongsTo(Company);

    return Review;
};
