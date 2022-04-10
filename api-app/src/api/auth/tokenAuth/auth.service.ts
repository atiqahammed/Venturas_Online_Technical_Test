import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth.dto';
import { CacheManagerService } from '../../../common/cache/cache.service';
require('dotenv').config();

@Injectable()
export class AuthService {

  private readonly log = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private readonly cacheManagerService: CacheManagerService
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    this.log.log(`Login Attempted, JWT generated for this fromAddress: ${authLoginDto.eoa}`);
    const payload = {
      fromAddress: user.fromAddress,
      apikey: user.apikey
    };

    return {
      AccessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { eoa, apikey } = authLoginDto;
    if (!eoa) {
      throw new UnauthorizedException();
    }

    const systemAPIKey =  process.env.API_KEY;;

    if (systemAPIKey != apikey) {
      throw new UnauthorizedException();
    }

    return { eoa, apikey };
  }
}
