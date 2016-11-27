import { merge } from 'lodash';

import { Record, User } from '../device/models';
import { UserMessage } from '../record/models/user';

export function update_user(user: Record, update: UserMessage): Promise<UserMessage> {
    var { id } = user;

    return new Promise((resolve, reject) => {
        User.update(update, { where: { id } })
            .then(() => resolve(merge(update, { id })))
            .catch(err => reject(err));
    });
}
