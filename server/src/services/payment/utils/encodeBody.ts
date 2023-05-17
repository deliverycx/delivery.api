function keys(o: object, first = "") {
    let strings = [];
    for (let k in o) {
        if (typeof o[k] === "object") {
            strings.push(
                (first + "_" + k + "_" + keys(o[k], first + "_" + k))
                    .slice(1)
                    .split(",")
            );
        } else {
            strings.push(k);
        }
    }
    return strings.flat();
}

export function encodeBody(b: object, key = "") {
    let result = {};

    for (let key in b) {
        if (typeof b[key] === "object") {
            for (let neskey of keys(b[key])) {
                result[`${key}_${neskey}`] = b[key][neskey] //.toString();
            }
        } else {
            result[`${key}`] = b[key] //.toString();
        }
    }

    return result;
}
