import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../../model/project.entity';
import { Repository } from 'typeorm';
import { TransactionReceipt } from '../../../model/transaction.receipt.entity';
import { TransactionReceiptStatus } from '../../../model/transaction.receipt.status.entity';
import { FundRaising } from '../../../model/fund.raising.entity';
import { TokenDistributionType } from '../../../model/token.distribution.type.entity';
import { TokenDistribution } from '../../../model/token.distribution.entity';
import QueueStatus from '../../../common/enums/queue-status.enum';
import { TxStatus } from '../../../common/enums/tx-status.enum';
import { CallbackRequest } from '../../../model/callback.request.entity';

@Injectable()
export class GraphWatcherDBHelperService {
  private readonly logger = new Logger(GraphWatcherDBHelperService.name);
  constructor(
    @InjectRepository(TransactionReceipt) private readonly transactionReceiptRepo: Repository<TransactionReceipt>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(FundRaising) private readonly fundRisingRepo: Repository<FundRaising>,
    @InjectRepository(TokenDistributionType) private readonly tokenDistributionTypeRepo: Repository<TokenDistributionType>,
    @InjectRepository(TokenDistribution) private readonly tokenDistributionRepo: Repository<TokenDistribution>,
    @InjectRepository(TransactionReceiptStatus) private readonly transactionReceiptStatusRepo: Repository<TransactionReceiptStatus>,
    @InjectRepository(CallbackRequest) private readonly callbackRequestRepo: Repository<CallbackRequest>,
    
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

  async getAllDistribution() {
    return await this.tokenDistributionRepo.find();
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

  async getPendingTxReceiptStatus() {
    try {
      const pendingTxReceiptStatus = await this.transactionReceiptStatusRepo.find({
        where:{
          MiningStatus: TxStatus.Pending
        },
        relations: ['TransactionReceipt']
      });
      return pendingTxReceiptStatus;
    } catch(error) {
      this.logger.error(error);
      return []
    }
  }

  async saveCallbackRequest(callbackInfo: CallbackRequest) {
    try {
      return await this.callbackRequestRepo.save(callbackInfo);
    } catch(error) {
      this.logger.error(error);
    }
  }

  async updateTransactionStatus(txReceiptStatusID: number): Promise<boolean> {

    try { 
      let txReceiptStatus = await this.transactionReceiptStatusRepo.findOne({
        where: {
          Id: txReceiptStatusID,
          MiningStatus: TxStatus.Pending
        },
        relations: ['TransactionReceipt']
      });
      if(txReceiptStatus && txReceiptStatus['TransactionReceipt'] && txReceiptStatus['TransactionReceipt'].QueueStatus == QueueStatus.Initialized) {
        txReceiptStatus.MiningStatus = TxStatus.Mined;
        await this.transactionReceiptStatusRepo.save(txReceiptStatus);
        //txReceiptStatus['TransactionReceipt'].QueueStatus = QueueStatus.Complete;
        let txReceipt = txReceiptStatus['TransactionReceipt'];
        txReceipt.QueueStatus = QueueStatus.Complete;
        await this.transactionReceiptRepo.save(txReceipt);
        return true;
      }
    }catch (error){
      this.logger.error(error);
    }


    return false;
  }
}