import { clone, merge } from 'lodash';

import { Record, User } from '../device/models';
import { UserMessage } from '../record/models/user';
import { encrypt } from '../crypto';
import { KEY_USER_EMAIL } from '../keys';

function prep(update: UserMessage): UserMessage {
    var { email } = update;
    update = clone(update);

    if (email) {
        update.email = encrypt(email, KEY_USER_EMAIL);
    }

    return update;
}

export function update_user(user: Record, update: UserMessage): Promise<UserMessage> {
    var { id } = user;


    return new Promise((resolve, reject) => {
        User.update(prep(update), { where: { id } })
            .then(() => resolve(merge(update, { id })))
            .catch(err => reject(err));
    });
}
