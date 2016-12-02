import { emitter } from './emitter';
import { logger } from '../log';
import { send } from '../notification/email';

import { BetaEmailInviteMessage } from '../record/models/beta_email_invite';

import { USER_INVITED } from '../events';

const log = logger(__filename);

emitter.on(USER_INVITED, (beta_invite: BetaEmailInviteMessage) => {
    var { email } = beta_invite;

    log.info('sending welcome email to beta invite');

    if (!email) {
        log.info('tried sending an email but beta invite does not have an email address');
        return;
    }

    send.welcome(email)
        .then(() => log.info('sent welcome email to beta invite'))
        .catch(err => log.error('error while emailing beta invite', err));
});

log.debug('registering "%s" hook', __filename);
