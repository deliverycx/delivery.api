import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";

@Injectable()
export class MailService {
    private transporter: Transporter;
    constructor() {
        this.transporter = createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        } as any);
    }

    async sendMail(to: Email) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: "Чек с сайта доставка.хинкалыч.рф",
            text: "hello world",
            html: "<b>hello world</b>"
        });
    }
}
