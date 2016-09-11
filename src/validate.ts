type Dict<T> = { [index: string]: T; };
type CheckedProps = Dict<boolean>;
type DefinedProps = Dict<() => boolean>;

type Validator = {
    checks: CheckedProps;
    validate: () => CheckedProps;
    reset: () => CheckedProps;
};

function checks(): CheckedProps {
    return {};
}

export default function validator(props: DefinedProps, run: boolean = false): Validator {
    var checker = { checks: checks(), validate, reset };

    function reduce_set(reducer) {
        return checker.checks = Object
            .keys(props)
            .reduce(reducer, checks());
    }

    function validate() {
        return reduce_set((store, prop) => {
            store[prop] = props[prop]();
            return store;
        });
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
