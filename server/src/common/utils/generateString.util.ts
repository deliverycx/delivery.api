export function generateString(numeralSystem: number, sliceCount: number = -8) {
    return Math.random().toString(numeralSystem).slice(sliceCount);
}
