import { BadRequestException, Injectable, Module,Logger } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import { ErrorType } from '../../../../common/enums/error-type.enum';
import { CommonValidationService } from "../../validation/common";
import {  NFTDef} from "../dto/nft.dto";




@Injectable()
export class NftValidationService {

  private readonly _commonValidationService: CommonValidationService;

  private readonly logger = new Logger(NftValidationService.name);

  constructor(
    commonValidationService: CommonValidationService,
  ) {
    this._commonValidationService = commonValidationService;
  }

  async checkNotNullForNFTParams(nftMetadata: any) {
    return new Promise(async (resolve, reject) => {
      if (nftMetadata?.image == null || nftMetadata?.image == '') {
        reject(
          `${ErrorType.ValidationError} Image can not be null for nft Metadata.`,
        );
      }

      if (nftMetadata?.name == null || nftMetadata?.name == '') {
        reject(
          `${ErrorType.ValidationError} Name can not be null for nft Metadata.`,
        );
      }

      let attributesWithoutSpace = [];
      for (const element of nftMetadata.attributes) {
        if (element?.display_type == '') {
          reject(
            `${ErrorType.ValidationError} display_type can not be blank for nft Metadata Attributes.`,
          );
        } else if (element?.display_type != null) {
          element.display_type = element.display_type.replace(/ /g, '_');
        }

        if (element?.trait_type == null || element?.trait_type == '') {
          reject(
            `${ErrorType.ValidationError} trait_type can not be null for nft Metadata Attributes.`,
          );
        } else {
          element.trait_type = element.trait_type.replace(/ /g, '_');
        }

        attributesWithoutSpace.push(element);
      }

      nftMetadata.attributes = attributesWithoutSpace;
      resolve(nftMetadata);
    });
  }
  
  async computeIdValidation(metadata: any) {
    try {      
      metadata = await this.checkNotNullForNFTParams(metadata);
      return metadata;
      
    } catch (error) {
      throw new BadRequestException(error); 
    }
  }

  async computeIdForBatch(dto: NFTDef) {

    let newDto = dto;

    newDto.nftMetadata = await this.computeIdValidation(newDto.nftMetadata);

    const metadata = {
      ...newDto.nftMetadata,
      attributes: [...newDto.nftMetadata['attributes']],
    };

    // const param: [number, number, string] = [
    //   dto.cardContentId,
    //   dto.serialNumber,
    //   this._commonValidationService.getMetadataDigest(metadata),
    // ];

      const param: [string] = [
        this._commonValidationService.getMetadataDigest(metadata),
      ];

    const ID_CAP = BigInt('10000000000000000');
    // const payload = ethers.utils.defaultAbiCoder.encode(
    //   ['uint256', 'uint256', 'bytes32'],
    //   param,
    // );

    const payload = ethers.utils.defaultAbiCoder.encode(
      ['bytes32'],
      param,
    );
    const payloadHash = ethers.utils.keccak256(payload);
    const hashAsBigNumber = BigNumber.from(payloadHash);
    const tokenIdAsBigInt = BigInt(hashAsBigNumber.toBigInt()) % ID_CAP;

    const tokenId = tokenIdAsBigInt.toString();

    return { tokenId , newDto };
  }

 
}

@Module({
  controllers: [],
  providers: [NftValidationService],
  exports: [NftValidationService]
})
​
export class NftValidationModule {  }