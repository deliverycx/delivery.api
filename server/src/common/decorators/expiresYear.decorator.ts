export function prepareYear() {
    return function (target: any, property: string) {
        let v = target[property];
        delete target[property];
        Object.defineProperty(target, property, {
            set: (nv: ExpiresType) => {
                if (nv.year.toString().length === 2) {
                    nv.year = `20${nv.year}`;
                }
                v = {
                    ...nv
                };
            },
            get: () => {
                return v;
            },
            enumerable: true,
            configurable: true
        });
    };
}
