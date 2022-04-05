import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";

function authValidate(req: Request) {
    if (!req.session.user) {
        throw new UnauthorizedException();
    }

    return true;
}

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        return authValidate(request);
    }
}
