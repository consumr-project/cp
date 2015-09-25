/// <reference path="../typings/tsd.d.ts"/>

declare function require(mod: string): any;
declare var i18n: any;

declare var TCP_BUILD_CONFIG: {
    embedly: { key: string; };
    firebase: { url: string; };
    locale: { dateFormat: string; };
};

declare module "reqwest" {
    function reqwest<T>(req: { url: string; type: string; }): Q.Promise<T>;
    export = reqwest
}

declare module "rangy" {
    export function init(): void;

    export function createHighlighter(): Highlighter;

    export function createClassApplier(className?: string, configuration?: ClassApplierOptions): ClassApplier;

    interface CharacterRange {
        start: number;
        end: number;
    }

    interface ClassApplier {
        className: string;
    }

    interface ClassApplierOptions {
        ignoreWhiteSpace?: Boolean;
        tagNames?: Array<string>;
    }

    interface Highlight {
        id: string;
        start: number;
        end: number;
        type: string,
        container: string;
        containerElementId: string;
        characterRange: CharacterRange
        classApplier: ClassApplier;
    }

    interface HighlightOptions {
        containerElementId?: string;
    }

    interface Highlighter {
        highlights: Array<Highlight>;
        addClassApplier(classApplier: ClassApplier): void;
        highlightSelection(className: string, options?: HighlightOptions): Highlight;
        serialize(): string;
        deserialize(serialized: string): void;
        highlight(options?: HighlightOptions): Highlight;
    }
}

interface FirebasePassportLoginError extends Error {
    code: string;
}

interface FirebasePassportLoginStatic {
    new (store: Firebase, hanlder: (err: FirebasePassportLoginError, user: any) => void, rootUrl: string);
    login(string): void;
    logout(): void;
}

declare var FirebasePassportLogin: FirebasePassportLoginStatic;
