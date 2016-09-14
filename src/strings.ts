export const en_US = load_i18n('en-US');
export const lolcat_US = load_i18n('lolcat-US');

export const LANG = {
    'en-US': 'en-US',
    'en_US': 'en-US',
    'lolcat-US': 'lolcat-US',
    'lolcat_US': 'lolcat-US',
};

export const i18n = {
    'en-US': en_US,
    'en_US': en_US,
    'lolcat-US': lolcat_US,
    'lolcat_US': lolcat_US,
};

export function pick_i18n(lang: string) {
    return i18n[normalize_i18n(lang)];
}

export function normalize_i18n(lang: string) {
    return lang in LANG ? LANG[lang] : 'en-US';
}

function load_i18n(lang: string) {
    return require(`../build/i18n.${lang}`).i18n;
}
