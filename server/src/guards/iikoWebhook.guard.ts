import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class IikoWebhookGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authorizationHeader = context.switchToHttp().getRequest();

        return true;
    }
}
