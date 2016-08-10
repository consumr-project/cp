import { Model } from 'sequelize';
import { v4 } from 'node-uuid';
import { User, Token } from 'cp/record';
import { nonce, encrypt, KEY_AUTH_TOKEN } from '../crypto';

interface PublicToken {
    plain_token: string;
    expiration_date: Date;
}

export class Manager {
    constructor(private conn: Model<Token, Token>) {}

    generate(expiration_date: Date, user: User): Promise<PublicToken> {
        let plain_token = nonce(16);

        let token = {
            id: v4(),
            token: encrypt(plain_token, KEY_AUTH_TOKEN),
            pub: plain_token,
            expiration_date,
            created_by: user.id,
            updated_by: user.id,
            created_date: new Date(),
            updated_date: new Date(),
        };

        let pub_token = {
            plain_token,
            expiration_date,
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

    valid(token: Token): boolean {
        return !!token && !token.used && !!token.token &&
            token.expiration_date > new Date();
    }
}
