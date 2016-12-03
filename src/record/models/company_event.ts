import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_event from './event';
import gen_company from './company';

export interface CompanyEventMessage extends IdentifiableMessage, StampedMessage {
    event_id: UUID;
    company_id: UUID;
}

export default (device: DbmsDevice) => {
    var Event = gen_event(device),
        Company = gen_company(device);

    var CompanyEvent = device.define<Message & CompanyEventMessage, CompanyEventMessage>('company_event', merge({
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
