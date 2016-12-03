import { Config, Type, tracking, merge } from '../utils';
import { Date2 } from '../../lang';
import { DbmsDevice } from '../../device/dbms';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

export interface EventMessage extends IdentifiableMessage, StampedMessage {
    title?: string;
    date?: Date2;
    logo?: string;
}

export default (device: DbmsDevice) =>
    device.define<Message & EventMessage, EventMessage>('event', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        title: {
            type: Type.STRING,
            allowNull: false
        },

        date: {
            type: Type.DATE,
            allowNull: false
        },

        logo: {
            type: Type.STRING,
            allowNull: false
        },
    }), Config);
