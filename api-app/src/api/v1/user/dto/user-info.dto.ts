import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SaveUserInfo {

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(300)
  email: string;


  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  EOA: string;


  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  password: string;
}


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

export class UserInfoResponse {
  name: string;
  email: string;
  id: number;
  EOA: string;
  createdDate: string;
}

export class DeleteUserInfo {

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}