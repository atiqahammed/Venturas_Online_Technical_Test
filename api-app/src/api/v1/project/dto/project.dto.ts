import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsISO8601,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
} from "class-validator";

export class SaveProjectType {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;
}

export class FundRaisingData {
  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  startDate: Date | string;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  endDate: Date | string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  targetAmount: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  minimumAmount: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  unit: string;
  

  @IsNotEmpty()
  @ApiProperty()
  @IsDecimal()
  tokenPrice: number;
}


export class FundRaisingDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsBoolean()
  needed: boolean;

  @ApiProperty()
  data: FundRaisingData;
}

export class TokenTypes {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  allocation: number;

  @ApiProperty()
  @IsDateString()
  fundStartDate: Date;

  @ApiProperty()
  @IsDateString()
  fundEndDate: Date;

  @ApiProperty()
  @IsNumber()
  fundTargetAmount: number;

  @ApiProperty()
  @IsNumber()
  fundMinimumAmount: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  fundUnit: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  type: string;
  
  @ApiProperty()
  @IsDecimal()
  fundTokenPrice: number;
}
export class CreateProjectTokenAllocationDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  tokenTypes: TokenTypes[];

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  calculateby: string;
 
}

export class TokenAllocationDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  tokenTypes: TokenTypes[];

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  calculateby: string;
  
}


export class EoAPercent {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  eoa: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  percent: number;
}

export class TokenDistributionDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  eoa: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  percent: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;
}

export class TokenAllocationBreakdownDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  distribution: TokenDistributionDTO[];
}

export class ProjectTypeResponse {
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

export class DeleteProjectType {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class CreateProjectRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  projectTypeId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  tokenName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  tokenSymbol: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  maxToken: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  votingPower: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  whoCanVote: string;

  @ApiProperty()
  fundRaising: FundRaisingDTO;

  @ApiProperty()
  tokenAllocation: CreateProjectTokenAllocationDTO;

  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  tokenDistribution: TokenDistributionDTO[];
}


export class FundRaisingResponseDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  uuid: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  transactionStatus: string;
}

export class FundRaising {
  
  @IsNotEmpty()
  @ApiProperty()
  needed: boolean;

  @IsNotEmpty()
  @ApiProperty()
  @IsObject()
  data: object;
}


export class ProjectResponse extends CreateProjectRequestDTO {

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  status: number;
  
}

export class DeleteProject {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class getProjectByIdRequest {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;
}

export class ProjectFunctionArgumentDTO {
  functionName: string;
  functionArgument: CreateProjectRequestDTO;
}

export class AllocationBreakdownFunctionArgumentDTO {
  functionName: string;
  functionArgument: TokenAllocationBreakdownDTO;
}

export class TokenAllocationFunactionArgumentDTO {
  functionName: string;
  functionArgument: TokenAllocationDTO;
}




export class CreateSupportProjectDTO {

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  eoa: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  unit: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  @IsISO8601()
  date: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;
}


export class SupportProjectFunctionArgumentDTO {
  functionName: string;
  functionArgument: CreateSupportProjectDTO;
}