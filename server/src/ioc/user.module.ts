import { Module } from "@nestjs/common";
import { favoriteProviders } from "src/components/favorites/providers/favorite.provider";
import { FavoriteRepository } from "src/components/favorites/repositories/base.repository";
import { IFavoriteRepository } from "src/components/favorites/repositories/interface.repository";
import { UserController } from "src/components/user/controllers/user.controller";
import { userProviders } from "src/components/user/providers/user.provider";
import { UserRepository } from "src/components/user/repositories/base.repository";
import { IUserRepository } from "src/components/user/repositories/interface.repository";
import { GenerateUsernameService } from "src/components/user/services/guestUsername.service";
import { IGuestGenerateService } from "src/components/user/services/guestUsername.stub";
import { UserUsecase } from "src/components/user/usecases/user.usecase";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "src/components/user/strategy/jwt.strategy";

import { PassportModule } from "@nestjs/passport";
import { RefreshStrategy } from "src/components/user/strategy/refreshToken.strategy";
import { SMSAeroServices } from "src/services/smsaero/smsaero.service";
import { SendCodeService } from "src/components/user/services/sendCode.service";
import { RedisModule } from "src/modules/redis/redis.module";
import { ProfileController } from "src/components/user/controllers/profie.controller";
import { ProfileRepository } from "src/components/user/repositories/profile.repository";
import { ProfileUseCase } from "src/components/user/usecases/profile.useCase";


@Module({
		imports: [
			RedisModule,
			JwtModule.register({
      secret: process.env.SESSION_SECRET,
			signOptions: {	
        expiresIn: '7d',
      },
    }),
    PassportModule,],
    controllers: [UserController,ProfileController],
    providers: [
        GenerateUsernameService,
        UserUsecase,
				JwtStrategy,
				RefreshStrategy,
				SMSAeroServices,
				SendCodeService,
        { provide: IUserRepository, useClass: UserRepository },
        { provide: IFavoriteRepository, useClass: FavoriteRepository },
        {
            provide: IGuestGenerateService,
            useClass: GenerateUsernameService
        },
        ...favoriteProviders,
        ...userProviders,
				ProfileRepository,
				ProfileUseCase
    ]
})
export class UserModule {}
