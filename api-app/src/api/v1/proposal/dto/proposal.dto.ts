import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsString,
  MaxLength,
} from "class-validator";

export class data1 {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  governance: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  utility: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  fundraising: number;
}

export class data2 {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  eoa: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  unit: string;
}

export class ProposalRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  proposalId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  proposalType: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  proposalText: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  action: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  minimumThreshold: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  expiryDate: Date;

  @ApiProperty()
  blacklistedEOA: string[];

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  actionPerformDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  instantTrigger: string;

  @ApiProperty()
  data: any;
}

export class ProposalResponse {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  txHash: string;

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

export class VoteRequest {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  proposalId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  eoa: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  vote: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  date: Date;
}

export class VoteResponse {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  txHash: string;

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



export class getProposalRequest {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  proposalId: number;
}

export class getAllProposalRequest {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;
}

export class createProposalResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  uuid: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  txHash: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  transactionStatus: string;


}


export class ProposalFunctionArgumentDTO {
  functionName: string;
  functionArgument: ProposalRequestDto;
}
export class VoteFunctionArgumentDTO {
  functionName: string;
  functionArgument: VoteRequest;
}

export class getProposalResponse {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  proposalId: number;

  
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  forVote: number;

  
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  againstVote: number;

  
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  abstainVote: number;

  dateTime: string;

  startDate: string;
 
  endDate: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  status: string;

  actionPerformed: string;

  functionName: string;
}


