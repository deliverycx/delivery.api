import {
    BadGatewayException,
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { catchError, Observable, throwError } from "rxjs";
import { BaseError } from "src/common/errors/base.error";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err: BaseError) => {
                return throwError(err);
            })
        );
    }
}
