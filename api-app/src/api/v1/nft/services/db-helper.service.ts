import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../../../../model/project.entity";
import { Repository } from "typeorm";
import { TransactionReceipt } from "../../../../model/transaction.receipt.entity";
import { NftInfo } from "../../../../model/nft.info.entity";
import { NftTransfer } from "../../../../model/nft.transfer.entity";
import QueueStatus from "src/common/enums/queue-status.enum";


@Injectable()
export class NFTBatchDBHelperService {
  private readonly logger = new Logger(NFTBatchDBHelperService.name);
  constructor(
    @InjectRepository(TransactionReceipt)
    private readonly transactionReceiptRepo: Repository<TransactionReceipt>,
    @InjectRepository(NftInfo)
    private readonly nftInfoRepo: Repository<NftInfo>,
    @InjectRepository(NftTransfer)
    private readonly nftTransferRepo: Repository<NftTransfer>
  ) {}

  async getTxReceiptByUUId(uuid: string) {
    let txReceipt = await this.transactionReceiptRepo.findOne({
      where: {
        UUId: uuid
      },
      relations: ['TransactionReceiptStatus']
    })
    return txReceipt;
  }

  async saveTxReceipt(txReceipt: TransactionReceipt): Promise<any> {
    try {
      let result = await this.transactionReceiptRepo.save(txReceipt);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not save tx receipt. Something went wrong."
      );
    }
  }

  async getNFTByMetadataHash(metadataHash: string) {
    this.logger.log(`checking nft by metadata hash: ${metadataHash}`);

    let nft = await this.nftInfoRepo.findOne({
      where: {
        MetaDataHash: metadataHash
      },
      relations:['NftTransfer']
    });

    return nft;
  }
 

  async saveNftInfo(nftInfo: NftInfo): Promise<any> {
    this.logger.log(`saveNftInfo has been initiated.`);   
    try {
      let result = await this.nftInfoRepo.save(nftInfo);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save NFT Info. Something went wrong.');
    }
  }

  async saveNftTransfer(nftTransfer: NftTransfer): Promise<any> {
    this.logger.log(`saveNftTransfer has been initiated.`);    
    try {
      let result = await this.nftTransferRepo.save(nftTransfer);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save NFT Transfer. Something went wrong.');
    }
  }

  async getNftBatchById(id: number) {
    const nft_batch = await this.nftInfoRepo.findOne({
      where: {
        Id: id
      },
      relations:['NftTransfer', ]
    });
    
    if(!nft_batch || !nft_batch.Id) {
      throw new BadRequestException(`Invalid nft Batch Id`);
    }

    return nft_batch;
  }

 



}
