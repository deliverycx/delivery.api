import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    UnauthorizedException
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        response.status(401).json({
            errors: "Нужна авторизация"
        });
    }
}
