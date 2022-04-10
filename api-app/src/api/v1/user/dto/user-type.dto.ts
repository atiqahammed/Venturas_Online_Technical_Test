import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SaveCompanyDTO {
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
  companyNameKana: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  urlOfHP: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  remarks: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  dateOfEstablishment: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  ownerId: number;
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