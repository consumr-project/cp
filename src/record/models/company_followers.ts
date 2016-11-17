import { CONFIG, merge } from '../utils';
// XXX import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

import gen_user from './user';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = gen_user(sequelize),
        Company = require('./company')(sequelize);

    var CompanyFollower = sequelize.define('company_follower', merge({
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
