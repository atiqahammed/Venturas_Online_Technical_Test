import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsDecimal, IsNotEmpty, isNumber, IsNumber, IsString, MaxLength } from 'class-validator';


export class Price {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  tokenPrice: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  pojectId: number;
}



export class getCurrentBalanceRequest {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
   @ApiProperty()
   @IsString()
   @MaxLength(300)
   eoa: string;
 
}