import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import QueueStatus from "../../../../common/enums/queue-status.enum";
import { CommonValidationService } from "../../validation/common";
import { CallbackService } from "../../../../common/callback.module";
import { FunctionNames } from "../../../../common/enums/function-names.enum";
import { CommonParameter } from "../../../../common/dto/common-parameter.dto";
import { TxStatus } from "../../../../common/enums/tx-status.enum";
import { TransactionReceipt } from '../../../../model/transaction.receipt.entity';
import { NftInfo } from '../../../../model/nft.info.entity';
import { NftTransfer } from '../../../../model/nft.transfer.entity';
import { v4 as uuidv4 } from "uuid";
import { NFTBatchDBHelperService } from "./db-helper.service";
import { NftValidationService } from "./nft.tokenId";
import { ProjectDBHelperService } from '../../../../api/v1/project/services/db-helper.service';

import {
 createNFTBatchRequest,NFTBatchFunctionArgumentDTO, NFTS,FunctionParameter,NFTMetaData, Attributes,NFTDef
} from "../dto/nft.dto";
import Operation from "../../../../common/enums/operation.enum";
const crypto = require("crypto");

const tokenArray = [3086080869598875];

@Injectable()
export class NFTService {
  private readonly logger = new Logger(NFTService.name);
  private mockProjectList = new Array();
  private readonly _callbackService: CallbackService;
  private readonly network = process.env.NETWORK || 'ganache';

  constructor(
    private readonly projectDbHelperService: ProjectDBHelperService,
    private readonly nftTokenIdService:  NftValidationService,
    private dbHelperService: NFTBatchDBHelperService,callbackService: CallbackService,
    private readonly validationService: CommonValidationService) 
    {
    this._callbackService = callbackService;
  }

  private getSortedNFTmetadataAttributes(attributeItems: Attributes[]): Attributes[] {
    const sorted_attribute= attributeItems.sort((item1, item2) => {
      if(item1['trait_type'] > item2['trait_type']) return 1;
      if(item1['trait_type'] < item2['trait_type']) return -1;
      return 0;
    });
    let sortedAttributes=[];
    if (attributeItems.length>0){
      for (let i = 0; i < sorted_attribute.length; i++) {
        let attribute=new Attributes();
        attribute.display_type=sorted_attribute[i].display_type;
        attribute.trait_type=sorted_attribute[i].trait_type;
        attribute.value=sorted_attribute[i].value;
        sortedAttributes.push(attribute);
      }  
    }
      
    return sortedAttributes;
  }

  private getNFTMetaDataArguments(nftMetadata: NFTMetaData): any {

   let Serialized_nftMetaData = new NFTMetaData();
   Serialized_nftMetaData.description = nftMetadata.description;   
   Serialized_nftMetaData.external_url = nftMetadata.external_url;
   Serialized_nftMetaData.image = nftMetadata.image;    
   Serialized_nftMetaData.name = nftMetadata.name;
   Serialized_nftMetaData.attributes = this.getSortedNFTmetadataAttributes(nftMetadata.attributes);
   return Serialized_nftMetaData;


  }


  private getSortedNFTS(nftItems: NFTS[]): NFTS[] {
    const nfts= nftItems.sort();
    let sortedNFTs=[];
    if(nftItems.length >0){
      for (let i = 0; i < nfts.length; i++) {
      let nft=new NFTS();
      nft.projectId = nfts[i].projectId;
      nft.nftMetadata = this.getNFTMetaDataArguments(nfts[i].nftMetadata);
      // let nnFT = this.getNFTMetaDataArguments(nfts[i].nftMetadata);
      sortedNFTs.push(nft);
      }
    }     
    return sortedNFTs;
  }


  private  getNftBatchFunctionArgument(createNftBatchDTO: createNFTBatchRequest): NFTBatchFunctionArgumentDTO {
    let nftBatchFunctionArgument = new NFTBatchFunctionArgumentDTO();
    
    let nftBatchDto = new createNFTBatchRequest();
    nftBatchDto.projectId = createNftBatchDTO.projectId;
    nftBatchDto.functionName = createNftBatchDTO.functionName;
    if(createNftBatchDTO.functionParameter) {      
      let functionParameter=new FunctionParameter();
      if(createNftBatchDTO.functionParameter.toEOA) {
        functionParameter.toEOA=createNftBatchDTO.functionParameter.toEOA;
      }

      if(createNftBatchDTO.functionParameter.nfts) {
        let sorted_NFTs= this.getSortedNFTS(createNftBatchDTO.functionParameter.nfts);
        functionParameter.nfts=sorted_NFTs;      
      }   
      nftBatchDto.functionParameter=functionParameter;  
    }
    nftBatchFunctionArgument.functionName = FunctionNames.CreateNftBatch;
    nftBatchFunctionArgument.functionArgument = nftBatchDto;
   
    return nftBatchFunctionArgument;
  }


  public async duplicateNFTCheck(metadataHash: string) {
    let nft = await this.dbHelperService.getNFTByMetadataHash(metadataHash)
    if(!nft) {
      return {
        isDuplicate: false
      }
    }

    if(nft.NftTransfer.length <= 0) {
      return {
        isDuplicate: false
      }
    }

    let createNFTTransfer = nft.NftTransfer.find((item) => item.Operation == Operation.Create);
    if(!createNFTTransfer) {
      return {
        isDuplicate: false
      }
    }

    let uuid = createNFTTransfer.UUId;
    let txReceipt = await this.dbHelperService.getTxReceiptByUUId(uuid);
    if(!txReceipt) {
      return {
        isDuplicate: false
      }
    }

    if(txReceipt.QueueStatus == QueueStatus.Draft) {
      return {
        isDuplicate: true,
        transactionStatus: QueueStatus.Draft,
        tokenId: nft.TokenId
      }
    }

    const status = txReceipt.TransactionReceiptStatus.find(item => item.MiningStatus ==  TxStatus.Mined || item.MiningStatus == TxStatus.Pending);
    if(!status) {
      return {
        isDuplicate: false
      }
    }
    
    const txHash = status.TxHash;

    return {
      isDuplicate: true,
      transactionStatus: QueueStatus.Complete,
      tokenId: nft.TokenId,
      txHash
    }
  }

  public async validateNFTs(nftBatchFunctionArgument: NFTBatchFunctionArgumentDTO, project: any) {
    
    let tokenIDs = [];
    let txHashs = [];
    let messages = [];
    let isSuccess = true;
    let nfts = [];

    for (let i = 0; i < nftBatchFunctionArgument.functionArgument.functionParameter.nfts.length; i++) {
      let newToken = new NFTDef();
      newToken.nftMetadata = nftBatchFunctionArgument.functionArgument.functionParameter.nfts[i].nftMetadata;
      const computedToken = await this.nftTokenIdService.computeIdForBatch(newToken);
      let tokenId = computedToken.tokenId.toString();

      let nftBatch = new NftInfo;
      nftBatch.Project = project;
      nftBatch.TxStatus = TxStatus.Mined;
      nftBatch.TokenId = tokenId;
      nftBatch.MetaDataJson = JSON.stringify(nftBatchFunctionArgument.functionArgument.functionParameter.nfts[i].nftMetadata);
      nftBatch.Url = "Crastonic.demo.url";
      nftBatch.MetaDataHash = this.validationService.getMetadataDigest(nftBatchFunctionArgument.functionArgument.functionParameter.nfts[i].nftMetadata);
      nftBatch.CurrentOwner = nftBatchFunctionArgument.functionArgument.functionParameter.toEOA;
      nftBatch.MinterContractAddress = nftBatchFunctionArgument.functionArgument.functionParameter.toEOA;
      nftBatch.IsNewNFT = true; 

      if(tokenIDs.includes(tokenId)) {
        throw new BadRequestException(`Found Duplicate NFT in the same request.`);
      }

      tokenIDs.push(tokenId);
      
      let duplicateNFTCheck = await this.duplicateNFTCheck(nftBatch.MetaDataHash);
      if(duplicateNFTCheck.isDuplicate) {
        txHashs.push(duplicateNFTCheck.txHash);
        messages.push(`NFT already exists. TokenId = ${tokenId}`);
        isSuccess = false;
      }
    }

    return {
      isSuccess,
      nfts,
      tokenIDs,
      txHashs,
      messages
    }
  }


  public async queueCreateNftBatch(createNftBatchDTO: createNFTBatchRequest): Promise<CommonParameter> {

    let nftBatchFunctionArgument = this.getNftBatchFunctionArgument(createNftBatchDTO);
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(nftBatchFunctionArgument.functionArgument.projectId);

    const nftValidationResult = await this.validateNFTs(nftBatchFunctionArgument, project);
    if(!nftValidationResult.isSuccess) {
      let response = new CommonParameter();
      response.transactionStatus = TxStatus.Mined;
      response.tokenId = nftValidationResult.tokenIDs;
      response.functionName = FunctionNames.CreateNftBatch;
      response.message = nftValidationResult.messages;
      response.transactionHash = nftValidationResult.txHashs;
      return response;
    }

    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.CreateNftBatch;
    txReceipt.FunctionArguments = JSON.stringify(nftBatchFunctionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(nftBatchFunctionArgument);
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;

    await this.dbHelperService.saveTxReceipt(txReceipt); 
    let tokenIDs = [];

    for (let i = 0; i < nftBatchFunctionArgument.functionArgument.functionParameter.nfts.length; i++) {
      let newToken=new NFTDef();
      newToken.nftMetadata=nftBatchFunctionArgument.functionArgument.functionParameter.nfts[i].nftMetadata;
      const computedToken=await this.nftTokenIdService.computeIdForBatch(newToken);
      let tokenId=computedToken.tokenId.toString();

      let nftBatch=new NftInfo;
      nftBatch.Project=project;
      nftBatch.TxStatus=TxStatus.Mined;
      nftBatch.TokenId=tokenId;
      nftBatch.MetaDataJson=JSON.stringify(nftBatchFunctionArgument.functionArgument.functionParameter.nfts[i].nftMetadata);
      nftBatch.Url="Crastonic.demo.url";
      nftBatch.MetaDataHash=this.validationService.getMetadataDigest(nftBatchFunctionArgument.functionArgument.functionParameter.nfts[i].nftMetadata);
      nftBatch.CurrentOwner=nftBatchFunctionArgument.functionArgument.functionParameter.toEOA;
      nftBatch.MinterContractAddress=nftBatchFunctionArgument.functionArgument.functionParameter.toEOA;
      nftBatch.IsNewNFT=true; 


      let nftBatchSaveResponse= await this.dbHelperService.saveNftInfo(nftBatch);


      // const nFTBatch = await this.dbHelperService.getNftBatchById(nftBatchSaveResponse.Id);
      let nftTransfer=new NftTransfer;
      nftTransfer.Project=project;
      nftTransfer.UUId=txReceipt.UUId;
      nftTransfer.TokenId=tokenId ;
      nftTransfer.Operation=Operation.Create;
      nftTransfer.From="0x";
      nftTransfer.To=nftBatchFunctionArgument.functionArgument.functionParameter.toEOA;
      nftTransfer.NftInfo=nftBatchSaveResponse;    
      await this.dbHelperService.saveNftTransfer(nftTransfer);

      tokenIDs.push(tokenId);

    }
       

    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.transactionStatus = TxStatus.Pending;
    response.tokenId = tokenIDs;
    response.functionName = txReceipt.FunctionName;
    return response;

  }
}

