interface Dict<T> {
    [index: string]: T;
}

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

    function validate() {
        return checker.checks = Object.keys(props).reduce((store, prop) => {
            store[prop] = props[prop]();
            return store;
        }, checks());
    }

    function reset() {
        return checker.checks = Object.keys(props).reduce((store, prop) => {
            store[prop] = undefined;
            return store;
        }, checks());
    }

    if (run) {
        validate();
    }

    return checker;
}
