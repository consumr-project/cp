interface Dict<T> {
    [index: string]: T;
}

type CheckedProps = Dict<boolean>;
type DefinedProps = Dict<() => boolean>;
type Validator = { validate: () => CheckedProps; checks: CheckedProps; };

function checks(): CheckedProps {
    return {};
}

export default function validator(props: DefinedProps, run: boolean = false): Validator {
    var checker = { checks: checks(), validate };

    function validate() {
        return checker.checks = Object.keys(props).reduce((store, prop) => {
            store[prop] = props[prop]();
            return store;
        }, checks());
    }

    if (run) {
        validate();
    }

    return checker;
}
