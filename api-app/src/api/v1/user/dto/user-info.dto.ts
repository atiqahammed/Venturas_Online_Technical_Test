import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class LoginDTO {

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(300)
  email: string;


  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  password: string;
}

export class DeleteUserInfo {

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}