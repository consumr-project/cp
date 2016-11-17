import { Record } from '../device/models';
import { UserMessage } from '../record/models/user';

export function set_user_avatar(user: Record, url: string): Promise<UserMessage> {
    return new Promise((resolve, reject) => {
        resolve({
            id: user.id,
            avatar_url: url,
        });
    });
}
