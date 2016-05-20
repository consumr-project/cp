import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize),
        Company = require('./company')(sequelize);

    var CompanyFollower = sequelize.define('company_follower', merge(TRACKING(), {
        company_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), CONFIG);

    Company.belongsToMany(User, { through: CompanyFollower });
    User.belongsToMany(Company, { through: CompanyFollower });

    return CompanyFollower;
};
