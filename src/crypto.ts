import { randomBytes, createCipher, createDecipher,
    Cipher, Decipher } from 'crypto';

const ALGORITHM = 'aes-256-ctr';

export const KEY_USER_EMAIL = process.env.CP_CRYPTO_USER_EMAIL_KEY;

function evaluate(f1: string, f2: string, text: string, obj: Cipher | Decipher): string {
    return obj.update(text, f1, f2) + obj.final(f2);
}

export function encrypt(text: string, key: string) {
    return evaluate('utf8', 'hex', text, createCipher(ALGORITHM, key));
}

export function decrypt(text: string, key: string) {
    return evaluate('hex', 'utf8', text, createDecipher(ALGORITHM, key));
}

export function nonce() {
    return randomBytes(32).toString('hex');
}
