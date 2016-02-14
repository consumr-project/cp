import { reduce } from 'lodash'

const DEBUG = 0;

const PART_START = '{{';
const PART_END = '}}';
const PART_INFOBOX_ITEM = '| ';

const REGEX_INFOBOX_ITEM_LABEL = /\|(.+?)\=/;
const REGEX_INFOBOX_ITEM_CONTENT = /\|.+?\=\s{0,}(.+)/;

export enum Tag {
    INFOBOX
};

interface Dictionary<T> {
    [index: string]: T;
}

interface Article {
    parts: { [index: string]: string[][] }
}

function guess_type(line: string): string {
    return line.substr(0, 2);
}

function new_store() {
    return [];
}

function pad(str: string | number, len: number = 6, use: string = '0'): string {
    var diff = len - str.toString().length;
    return !diff ? str.toString() :
        new Array(diff + 1).join(use) + str;
}

function prep_lines(markup: string): string[] {
    return markup.split('\n')
        .filter(line => !!line)
        .map(line => line.trim());
}

function contains(str: string, needle: string): Boolean {
    return str.indexOf(needle) !== -1;
}

function clean_match(match: string[]): string {
    return match && match[1] ? match[1].trim() : '';
}

export function infobox(lines: string[]): Dictionary<string> {
    var curr: string;

    return reduce(lines, (dict, line) => {
        var label, content;

        switch (guess_type(line)) {
            case PART_INFOBOX_ITEM:
                label = line.match(REGEX_INFOBOX_ITEM_LABEL);
                content = line.match(REGEX_INFOBOX_ITEM_CONTENT);
                curr = clean_match(label);

                if (curr) {
                    dict[curr] = clean_match(content);
                }

                break;

            default:
                if (curr) {
                    dict[curr] += `\n${line.trim()}`;
                }

                break;
        }

        return dict;
    }, <Dictionary<string>>{});
}

export function wikitext(markup: string = ''): Article {
    var level: number = 0;

    var lines = prep_lines(markup),
        store = new_store();

    var article: Article = {
        parts: {
            [Tag.INFOBOX]: []
        }
    };

    lines.map((line, index) => {
        function log(...args: any[]): void {
            if (DEBUG) {
                args.unshift(`[${pad(index)}]`);
                console.log.apply(console, args);
            }
        }

        switch (guess_type(line)) {
            case PART_START:
                level++;
                log({ part: 'PART_START', level, line });

                if (level === 1) {
                    store = new_store();
                }

                store.push(line);

                if (contains(line, PART_END)) {
                    store = new_store();
                    level--;
                    log({ part: 'PART_START--PART_END', level });
                }

                break;

            case PART_END:
                level--;

                log({ part: 'PART_END', level, line });
                if (level < 1) {
                    article.parts[Tag.INFOBOX].push(store);
                    store = new_store();
                }

                break;

            default:
                store.push(line);

                log({ part: 'DEFAULT', level, line });
                if (contains(line, PART_START)) {
                    level++;
                    log({ part: 'DEFAULT--PART_START', level });
                }

                if (contains(line, PART_END)) {
                    level--;
                    log({ part: 'DEFAULT--PART_END', level });
                }

                break;
        }
    });

    return article;
};
