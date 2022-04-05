import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments
} from "class-validator";

export function IsCardCvv(
    property?: string,
    validationOptions?: ValidationOptions
) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "IsCardCvv",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(n: string, args: ValidationArguments) {
                    if (typeof +n === "number" && n.toString().length === 3)
                        return true;

                    return false;
                }
            }
        });
    };
}
