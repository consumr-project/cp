const EMAIL = /\b[a-zA-Z0-9\u00C0-\u017F._%+-]+@[a-zA-Z0-9\u00C0-\u017F.-]+\.[a-zA-Z]{2,}\b/;

type Dict<T> = { [index: string]: T; };
type CheckedProps = Dict<boolean>;
type DefinedProps = Dict<() => boolean>;

type Validator = {
    checks: CheckedProps;
    validate: () => boolean;
    reset: () => CheckedProps;
};

function checks(): CheckedProps {
    return {};
}

export function email(str: string): boolean {
    return EMAIL.test(str);
}

export default function validator(props: DefinedProps, run: boolean = false): Validator {
    var checker = { checks: checks(), validate, reset };

    function reduce_set(reducer) {
        return checker.checks = Object
            .keys(props)
            .reduce(reducer, checks());
    }

    function validate() {
        var valid = true;

        reduce_set((store, prop) => {
            store[prop] = props[prop]();
            valid = valid && store[prop];
            return store;
        });

        return valid;
    }

    function reset() {
        return reduce_set((store, prop) => {
            store[prop] = undefined;
            return store;
        });
    }

    if (run) {
        validate();
    }

    return checker;
}
