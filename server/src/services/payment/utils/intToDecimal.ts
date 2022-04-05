export function intToDecimal(num: number) {
    if (num.toString().match(/\./)) {
        return num.toString();
    }

    return num + ".00";
}
