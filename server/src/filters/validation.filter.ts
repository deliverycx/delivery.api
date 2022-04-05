import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(BadRequestException)
export class ValidationException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        const status = exception.getStatus();
        const excres = exception.getResponse();
        const message =
            typeof excres === "object"
                ? (excres as { message: Array<string> }).message
                : "unknown error";

        response.status(status).json({
            path: request.path,
            errors: message
        });
    }
}
