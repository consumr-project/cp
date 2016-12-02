import { Model } from 'sequelize';
import { v4 } from 'node-uuid';
import { TokenMessage } from '../record/models/token';
import { UserMessage } from '../record/models/user';
import { nonce, encrypt } from '../crypto';
import { KEY_AUTH_TOKEN } from '../keys';

interface PublicToken {
    plain_token: string;
    reason: string;
    expiration_date: Date;
}

export class Manager {
    constructor(private conn: Model<TokenMessage, TokenMessage>) {}

    generate(expiration_date: Date, reason: string, user: UserMessage): Promise<PublicToken> {
        let plain_token = nonce(16);

        let token = {
            id: v4(),
            token: encrypt(plain_token, KEY_AUTH_TOKEN),
            pub: plain_token,
            expiration_date,
            reason,
            created_by: user.id,
            updated_by: user.id,
            created_date: new Date(),
            updated_date: new Date(),
        };

        let pub_token = {
            plain_token,
            expiration_date,
            reason,
        };

        return this.conn.create(token)
            .then(() => pub_token);
    }

    validate(plain_token: string): Promise<boolean> {
        let token = encrypt(plain_token, KEY_AUTH_TOKEN);
        return this.conn.findOne({
            where: { token }
        }).then(this.valid);
    }

    valid(token: TokenMessage): boolean {
        return !!token && !token.used && !!token.token &&
            token.expiration_date > new Date();
    }
}
