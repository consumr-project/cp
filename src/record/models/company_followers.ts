import { Config, Type, merge /* tracking */ } from '../utils';

import gen_company from './company';
import gen_user from './user';

export default sequelize => {
    var User = gen_user(sequelize),
        Company = gen_company(sequelize);

    var CompanyFollower = sequelize.define('company_follower', merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Company.belongsToMany(User, { through: CompanyFollower });
    User.belongsToMany(Company, { through: CompanyFollower });

    return CompanyFollower;
};
