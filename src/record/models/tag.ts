import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

export interface TagMessage extends IdentifiableMessage, StampedMessage {
    approved: boolean;
    'en-US': string;
}

export default (device: DbmsDevice) =>
    device.define<Message & TagMessage, TagMessage>('tag', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        approved: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

        'en-US': {
            type: Type.STRING,
            allowNull: false
        }
    }), Config);
