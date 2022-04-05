import { CreateMessage } from "./interface";

export function generateMessage(body: CreateMessage.IRecivedBody): string {
    let result = ``;

    result += `Заказ: \n`;
    body.items.forEach((el) => {
        result += `${el.name} x${el.amount}\n`;
    });

    result += `\n\n`;
    result += `Данные о пользователе: \n`;
    result += `Тип доставки: ${body.orderType} \n`;
    result += `Адрес: ${body.address}\n`;
    result += `Телефон: ${body.phone}\n`;
    result += `Имя: ${body.name}\n`;
    result += `Комментарий: ${body.comment}`;

    return result;
}
