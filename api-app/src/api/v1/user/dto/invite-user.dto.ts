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

export class UserRegistrationDTO {

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  uuid: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  zipCode: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  address: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  department: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  temporaryPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  remarks: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  dateOfBirth: string;
}