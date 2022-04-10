import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserTypeDBHelperService } from "./services/db-helper.service";
import { UserInfo } from "../../../model/user.info.entity";
import { CommonCacheModule } from "../../../common/cache/cache.module";
import { AuthService } from '../../auth/tokenAuth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/headerAuth/auth.module';
import { TokenAuthModule } from '../../auth/tokenAuth/auth.module';
import { Invitation } from "../../../model/invittion.entity";
import { Company } from "../../../model/company.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    TypeOrmModule.forFeature([Invitation]),
    TypeOrmModule.forFeature([Company]),
    CommonCacheModule,AuthModule,TokenAuthModule
  ],
  controllers: [UserController],
  providers: [UserService, UserTypeDBHelperService, AuthService, JwtModule],
  exports: [],
})
export class UserModule {}
