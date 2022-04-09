import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SaveUserType {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;
}

export class UserTypeResponse {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;

  createdDate: string;
}

export class DeleteUserType {

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}