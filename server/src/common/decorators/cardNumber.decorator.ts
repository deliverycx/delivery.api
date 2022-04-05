import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments
} from "class-validator";

export function IsCardNumber(
    property?: string,
    validationOptions?: ValidationOptions
) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "IsCardNumber",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(n: string, args: ValidationArguments) {
                    if (n.length < 15 || n.length > 16) {
                        return false;
                    }

                    n = n.replace(/\s/g, "");
                    let sum = +n.charAt(n.length - 1);
                    for (let i = n.length - 2; i >= 0; i--) {
                        let valueInIndex = +n.charAt(i);

                        if (i % 2 === 0) {
                            const product = valueInIndex * 2;
                            valueInIndex = product > 9 ? product - 9 : product;
                        }
                        sum += valueInIndex;
                    }

                    if (sum === 0 || n.match(/\D/)) {
                        return false;
                    }

                    return sum % 10 === 0;
                }
            }
        });
    };
}
