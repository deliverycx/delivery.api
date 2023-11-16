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

	
    function getFiniteValue(obj) {
			getProp(obj);
	
			function getProp(o) {
					for(var prop in o) {
							if(typeof(o[prop]) === 'object') {
									getProp(o[prop]);
									//result[`${prop}`] = String(o[prop])
									console.log(prop);
							} else {
									//console.log('Finite value: ',o[prop])
									//result = {...result,[`${prop}`]:o[prop]}
									//result[`${prop}`] = String(o[prop])
							}
					}
			}
		}
		getFiniteValue(b)
		console.log('result',result);
    return result;
}
