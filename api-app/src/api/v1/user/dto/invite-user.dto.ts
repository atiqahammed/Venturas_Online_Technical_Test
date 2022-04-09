import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class InviteUserDTO {

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(300)
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  invitedBy: number;

  @IsNotEmpty()
  @ApiProperty()
  companyId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  userType: string;
}