import { Config, Type, merge /* tracking */ } from '../utils';
import { IdentifiableMessage, StampedMessage } from '../message';

import gen_event from './event';

export interface CompanyEventMessage extends IdentifiableMessage, StampedMessage {
    event_id: string;
    company_id: string;
}

export default sequelize => {
    var Event = gen_event(sequelize),
        Company = require('./company')(sequelize);

    var CompanyEvent = sequelize.define('company_event', merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },

        event_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Company.belongsToMany(Event, { through: CompanyEvent });
    Event.belongsToMany(Company, { through: CompanyEvent });

    return CompanyEvent;
};
