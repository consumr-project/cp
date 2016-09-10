import { v4 } from 'node-uuid';
import { BetaEmailInvite } from '../device/models';
import { User as IUser, BetaEmailInvite as IBetaEmailInvite } from 'cp/record';

interface BetaEmailInviteMessage {
    email: string;
}

function create_email_invite(
    msg: BetaEmailInviteMessage,
    user: IUser, approved: boolean = false
): IBetaEmailInvite {
    return {
        id: v4(),
        email: msg.email,
        created_by: user.id,
        created_date: Date.now(),
        updated_by: user.id,
        updated_date: Date.now(),
        approved: approved,
        approved_by: approved ? user.id : null,
        approved_date: approved ? Date.now() : null,
    };
}

export function save_unapproved_email_invite(invite: BetaEmailInviteMessage, you: IUser) {
    return new Promise<IBetaEmailInvite>((resolve, reject) => {
        BetaEmailInvite.create(create_email_invite(invite, you, false))
            .then(resolve)
            .catch(reject);
    });
}

export function save_approved_email_invite(invite: BetaEmailInviteMessage, you: IUser) {
    return new Promise<IBetaEmailInvite>((resolve, reject) => {
        BetaEmailInvite.create(create_email_invite(invite, you, true))
            .then(resolve)
            .catch(reject);
    });
}

export function approve_email_invite(invite: BetaEmailInviteMessage, you: IUser) {
    return new Promise<boolean>((resolve, reject) => {
        BetaEmailInvite.update({
            approved: true,
            approved_by: you.id,
            approved_date: Date.now(),
        }, {
            where: {
                email: invite.email,
            }
        })
            .then(() => resolve(true))
            .catch(reject);
    });
}
