'use strict';

const me = require('../package.json');

/**
 * http://patorjk.com/software/taag/#p=display&f=Isometric1&t=cp
 *          ___           ___
 *         /\  \         /\  \
 *        /::\  \       /::\  \
 *       /:/\:\  \     /:/\:\  \
 *      /:/  \:\  \   /::\~\:\  \
 *     /:/__/ \:\__\ /:/\:\ \:\__\
 *     \:\  \  \/__/ \/__\:\/:/  /
 *      \:\  \            \::/  /
 *       \:\  \            \/__/
 *        \:\__\
 *         \/__/
 *    
 * @param {Funciton} log
 * @return {void}
 */
function cp_ascii(log) {

    log('                                                    ');
    log('                                                    ');
    log('                                                    ');
    log('                ___           ___                   ');
    log('               /\\  \\         /\\  \\              ');
    log('              /::\\  \\       /::\\  \\             ');
    log('             /:/\\:\\  \\     /:/\\:\\  \\          ');
    log('            /:/  \\:\\  \\   /::\\~\\:\\  \\        ');
    log('           /:/__/ \\:\\__\\ /:/\\:\\ \\:\\__\\      ');
    log('           \\:\\  \\  \\/__/ \\/__\\:\\/:/  /       ');
    log('            \\:\\  \\            \\::/  /           ');
    log('             \\:\\  \\            \\/__/            ');
    log('              \\:\\__\\                             ');
    log('               \\/__/                               ');
    log('                                                    ');
    log('                                                    ');
    log('                                                    ');
    log('           | consumr-project                        ');
    log(`           | ${me.name} v${me.version}              `);
    log('                                                    ');
    log('                                                    ');
}

module.exports = { cp_ascii };
