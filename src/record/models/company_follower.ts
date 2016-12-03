import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_company from './company';
import gen_user from './user';

export interface CompanyFollowerMessage extends IdentifiableMessage, StampedMessage {
    user_id: UUID;
    company_id: UUID;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Company = gen_company(device);

    var CompanyFollower = device.define<Message & CompanyFollowerMessage, CompanyFollowerMessage>('company_follower', merge({
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
