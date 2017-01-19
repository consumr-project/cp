import * as imgur from 'imgur';
import * as config from 'acm';

const IMGUR_ALBUM_ID = config('files.avatars.imgur.album_id');
const IMGUR_CLIENT_ID = config('files.avatars.imgur.client_id');
const IMGUR_PASSWORD = config('files.avatars.imgur.password');
const IMGUR_USERNAME = config('files.avatars.imgur.username');

export namespace Model {
    export interface Base {
        id?: string;
        link?: string;
    }

    export interface ImgurImage extends Base {
        id: string;
        link: string;
    }
}

export namespace Payload {
    export interface Base {
        base64?: string;
    }

    export class ImgurImage implements Base {
        base64: string;

        constructor(base64: string) {
            this.base64 = base64;
        }
    }
}

function imgur_upload(base64: string): Promise<Model.ImgurImage> {
    return new Promise<Model.ImgurImage>((resolve, reject) => {
        imgur.setCredentials(IMGUR_USERNAME, IMGUR_PASSWORD, IMGUR_CLIENT_ID);
        imgur.uploadBase64(base64, IMGUR_ALBUM_ID)
            .then(res => resolve(res.data))
            .catch(reject);
    });
}

export function save(payload: Payload.Base): Promise<Model.Base> {
    if (payload instanceof Payload.ImgurImage) {
        return imgur_upload(payload.base64);
    } else {
        throw new Error('Invalid payload');
    }
}
