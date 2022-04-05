import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments
} from "class-validator";

export function IsCardExpires(
    property?: string,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsCardExpires",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: ExpiresType, args: ValidationArguments) {
                    let { year, month } = value;
                    const currentDate = new Date()
                        .toDateString()
                        .match(/(\d{2}\s\d{4})$/)[1]
                        .split(" ");

                    if (year.toString().length === 4) {
                        year = year.toString().slice(-2);
                    }

                    if (+currentDate[1].slice(-2) > +year) {
                        return false;
                    }
                    if (+month > 12 || +month < 1) {
                        return false;
                    }
                    if (+year === +currentDate[1].slice(-2)) {
                        if (+month < +currentDate[0]) return false;
                    }

                    return true;
                }
            }
        });
    };
}
