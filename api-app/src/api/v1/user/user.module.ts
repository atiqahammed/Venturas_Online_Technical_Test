import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserTypeDBHelperService } from "./services/db-helper.service";
import { UserType } from "../../../model/user.type.entity";
import { UserInfo } from "../../../model/user.info.entity";
import { Project } from "../../../model/project.entity";
import { CommonCacheModule } from "../../../common/cache/cache.module";
import { AuthService } from '../../auth/tokenAuth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/headerAuth/auth.module';
import { TokenAuthModule } from '../../auth/tokenAuth/auth.module';
import { Invitation } from "../../../model/invittion.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([UserType]),
    TypeOrmModule.forFeature([UserInfo]),
    TypeOrmModule.forFeature([Invitation]),
    CommonCacheModule,AuthModule,TokenAuthModule
  ],
  controllers: [UserController],
  providers: [UserService, UserTypeDBHelperService,AuthService,JwtModule],
  exports: [],
})
export class UserModule {}
