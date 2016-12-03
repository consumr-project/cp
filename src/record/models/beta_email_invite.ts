import { Config, Type, tracking, merge } from '../utils';
import { Date2 } from '../../lang';
import { DbmsDevice } from '../../device/dbms';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

export interface BetaEmailInviteMessage extends IdentifiableMessage, StampedMessage {
    email?: string;
    approved?: boolean;
    approved_by?: string;
    approved_date?: Date2;
}

export default (device: DbmsDevice) =>
    device.define<Message & BetaEmailInviteMessage, BetaEmailInviteMessage>('beta_email_invite', merge(tracking(), {
        email: {
            type: Type.STRING,
            allowNull: false,
            primaryKey: true
        },

        approved: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        approved_by: {
            type: Type.UUID,
            allowNull: true,
        },

        approved_date: {
            type: Type.DATE,
            allowNull: true,
        },
    }), Config);
