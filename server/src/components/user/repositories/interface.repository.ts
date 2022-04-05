import { UserEntity } from "../entities/user.entity";
import { IUpdateProps } from "../interfaces/update.interface";

export abstract class IUserRepository {
    abstract create(
        username: string,
        name: string,
        phone: string
    ): Promise<UserEntity>;

    abstract getUser(userId: UniqueId): Promise<UserEntity>;

    abstract updateUser(
        userId: UniqueId,
        updateProps: IUpdateProps
    ): Promise<UserEntity>;
}
