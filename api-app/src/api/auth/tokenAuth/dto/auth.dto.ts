import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  eoa: string;

  @ApiHideProperty()
  apikey: string;
}
