import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CommonCacheModule } from '../../../common/cache/cache.module';

@Module({
  imports: [
    PassportModule, CommonCacheModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY, signOptions: { expiresIn: process.env.JWT_TIMEOUT_IN_SECONDS }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class TokenAuthModule { }
