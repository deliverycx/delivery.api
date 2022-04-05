import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { isInSubnet } from "is-in-subnet";

@Injectable()
export class YooWebhookGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const allowedIp: Array<string> = [
            "91.200.28.0/24",
            "54.36.30.17/32",
            "91.227.52.0/24"
        ];
        const ip = request.ip;

        if (isInSubnet(ip, allowedIp)) {
            return true;
        } else {
            return false;
        }
    }
}
