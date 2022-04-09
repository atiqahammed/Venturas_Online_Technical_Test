import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../model/project.entity';
import { Repository } from 'typeorm';
import { NftInfo } from '../../model/nft.info.entity';
import { NftTransfer } from '../../model/nft.transfer.entity';
import { TransactionReceipt } from '../../model/transaction.receipt.entity';
import { TransactionReceiptStatus } from '../../model/transaction.receipt.status.entity';
import { v4 as uuidv4 } from "uuid";
import { FundRaising } from '../../model/fund.raising.entity';
import { TokenDistributionType } from '../../model/token.distribution.type.entity';
import { TokenDistribution } from '../../model/token.distribution.entity';
import QueueStatus from '../../common/enums/queue-status.enum';

@Injectable()
export class TxProcessorDBHelperService {
  private readonly logger = new Logger(TxProcessorDBHelperService.name);
  constructor(
    @InjectRepository(TransactionReceipt) private readonly transactionReceiptRepo: Repository<TransactionReceipt>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(FundRaising) private readonly fundRisingRepo: Repository<FundRaising>,
    @InjectRepository(TokenDistributionType) private readonly tokenDistributionTypeRepo: Repository<TokenDistributionType>,
    @InjectRepository(TokenDistribution) private readonly tokenDistributionRepo: Repository<TokenDistribution>,
    @InjectRepository(TransactionReceiptStatus) private readonly transactionReceiptStatusRepo: Repository<TransactionReceiptStatus>,
    
    ) { }

  async getDraftTransaction() {
    try {
      const draftTxs = await this.transactionReceiptRepo.find({
        where: {
          QueueStatus : QueueStatus.Draft
        }
      });
      return draftTxs;
    }catch(error) {
      this.logger.error(error);
    }
    return [];
  }

  async saveTxReceiptStatus(txReceiptStatus: TransactionReceiptStatus, txReceiptId: number) {
    try {
      const txReceipt = await this.transactionReceiptRepo.findOne({
        where: {
          Id: txReceiptId,
          QueueStatus: QueueStatus.Draft
        }
      });
      if(txReceipt) {
        txReceipt.QueueStatus = QueueStatus.Initialized;
        txReceiptStatus.TransactionReceipt = txReceipt;
        await this.transactionReceiptRepo.save(txReceipt);
        const txReceiptStatusResult = await this.transactionReceiptStatusRepo.save(txReceiptStatus);
        return txReceiptStatusResult;
      }
      
    }catch(error) {
      this.logger.error(error);
    }
  }
}