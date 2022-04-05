function to10(ip) {
    const splitAddr = ip.split(".");

    // Бежим по всему массиву октетов
    // И переводим в 10 представление
    return splitAddr
        .reduce((acc, el) => {
            return (
                acc +
                "." +
                el
                    .split("")
                    .reverse()
                    .reduce((inAcc, inEl, index) => {
                        return inAcc + (+inEl == 1 ? Math.pow(2, index) : 0);
                    }, 0)
            );
        }, "")
        .slice(1);
}

console.log(to10("11000000.10101000.00001000.00000000"));

function to2(ip) {
    const splitAddr = ip.split(".");

    return splitAddr
        .reduce((acc, el) => {
            let res = "";
            let pow = 7;
            while (pow >= 0) {
                console.log(pow);
                console.log(el - Math.pow(2, pow));
                if (el >= Math.pow(2, pow)) {
                    el -= Math.pow(2, pow);
                    res += "1";
                } else {
                    res += "0";
                }

                --pow;
            }

            return acc + "." + res;
        }, "")
        .slice(1);
}

console.log(to2("192.168.8.0"));

function isSubnet(ip, arr) {}

/* console.log(isSubnet("77.75.156.11", ["77.75.153.0/25", "77.75.156.11"])); */
