import { ApiProperty } from "@nestjs/swagger";
import { isNotEmpty, IsNotEmpty, isPositive, IsString, MaxLength } from "class-validator";



export class GetContractAddressRequestDTO {

    @IsNotEmpty()
    @ApiProperty()
    projectId: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @MaxLength(300)
    addressType: string;
}

export class GetContractAddressResponseDTO {
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @MaxLength(300)
    contractAddress: string;
}