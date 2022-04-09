import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsString,IsOptional,IsEthereumAddress,ValidateNested,
  MaxLength,IsObject
} from "class-validator";
import { Type } from 'class-transformer';

export class Attributes {
  display_type?: string;
  trait_type: string;
  value: string | number;
}




export class NFTMetaData {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  external_url: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  image: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  name: string;

  @ApiProperty()
  attributes: Attributes[];
}



export class NftDef {

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(300)
  cardContentId: number;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(300)
  serialNumber: number;

  @ApiProperty()
  nftMetadata: NFTMetaData;
}


export class NFTS {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  nftMetadata: NFTMetaData;
}

export class FunctionParameter {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  toEOA: string;

  @ApiProperty()
  nfts: NFTS[];
}

export class createNFTBatchRequest {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  functionName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsObject()
  functionParameter: FunctionParameter;
}

export class NftBatchResponse {
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

  transactionStatus: string;
  tokenId: number[];
}


export class NFTBatchFunctionArgumentDTO {
  functionName: string;
  functionArgument: createNFTBatchRequest;
}


export class NftMetadataAttribute {
  display_type?: string;
  trait_type: string;
  value: string | number;
}

export class NftMetadata {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  external_url: string;
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  attributes: NftMetadataAttribute[];
}

export class CreateNftFunctionParameterBatch {
  
  @IsEthereumAddress()
  @IsOptional()
  toKUW: string;

  @IsEthereumAddress()
  @IsOptional()
  toEOA: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NFTDef)
  nfts: NFTDef[];
}
export class NFTDef {
  @IsNotEmpty()
  @IsNumber()
  cardContentId: number;

  @IsNumber()
  serialNumber: number;

  @IsNotEmpty()
  @ValidateNested()
  nftMetadata: NftMetadata;
}

export class CreateNftBatchDTO {
  @IsNotEmpty()
  partner: string;

  @IsNotEmpty()
  functionName: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateNftFunctionParameterBatch)
  functionParameter: CreateNftFunctionParameterBatch;
}

export class CreateNftBatchDTOExt extends CreateNftBatchDTO {
  uuid: string;
  transactionReceiptId: number;
  tokenId?: string[];
}

