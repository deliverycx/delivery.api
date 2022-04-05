import { ErrorResponse } from "@a2seven/yoo-checkout";
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Inject
} from "@nestjs/common";
import { AxiosError } from "axios";
import { Request, Response } from "express";

@Catch(ErrorResponse)
export class PaymentException implements ExceptionFilter {
    catch(exception: AxiosError, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();

        response.status(exception.response.status).json({
            path: request.path,
            errors: exception.response.data
        });
    }
}
