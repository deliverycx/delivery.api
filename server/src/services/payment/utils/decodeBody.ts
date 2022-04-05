export function decodeBody<T>(o: any): T {
    let result = {} as any;

    for (let key in o) {
        const keysArray = key.split("_");
        let intermidate = {};
        for (let i = keysArray.length - 1; i >= 0; i--) {
            if (i === keysArray.length - 1) {
                intermidate = {
                    [keysArray[i]]: o[key]
                };
            } else {
                intermidate = {
                    [keysArray[i]]: {
                        ...result[keysArray[i]],
                        ...intermidate
                    }
                };
            }
        }

        result = {
            ...result,
            ...intermidate
        };
    }

    return result;
}
