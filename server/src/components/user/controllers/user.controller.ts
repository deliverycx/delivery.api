import {
    Body,
    Controller,
    Patch,
    Post,
    Req,
    Res,
    Session
} from "@nestjs/common";
import { Request, response, Response } from "express";
import { UserUsecase } from "../usecases/user.usecase";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { UpdateDTO } from "../dto/update.dto";

@ApiTags("User endpoints")
@Controller("user")
export class UserController {
    constructor(private readonly userUsecase: UserUsecase) {}

    @Post("create")
    @ApiResponse({
        status: 200,
        type: UserEntity
    })
    async create(
        @Session() session: Record<string, string>,
        @Res() response: Response
    ) {
        let user: UserEntity;

        if (session.user) {
            user = await this.userUsecase.getUser(session.user);

            if (!user.check()) {
                user = await this.userUsecase.createGuest();
                session.user = user.getId;
            }

            return response.status(200).json(user);
        }

        user = await this.userUsecase.createGuest();
        session.user = user.getId;

        response.status(200).json(user);
    }

    @Patch("update")
    async update(
        @Session() session: Record<string, string>,
        @Body() body: UpdateDTO,
        @Res() response: Response
    ) {
        await this.userUsecase.updateUser(session.user, body);

        response.status(201).json();
    }
}
