import { Record, User } from '../device/models';
import { UserMessage } from '../record/models/user';

export function set_user_avatar(user: Record, url: string): Promise<UserMessage> {
    return new Promise((resolve, reject) => {
        User.update(
            { avatar_url: url },
            { where: { id: user.id } }
        )
            .then(() => resolve({ id: user.id, avatar_url: url }))
            .catch(err => reject(err));
    });
}
