import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NftInfo } from '../../../../model/nft.info.entity';
import { NftTransfer } from '../../../../model/nft.transfer.entity';
import { TransactionReceipt } from '../../../../model/transaction.receipt.entity';
import { TransactionReceiptStatus } from '../../../../model/transaction.receipt.status.entity';

@Injectable()
export class PriceDBHelperService {

  constructor(
    @InjectRepository(NftInfo) private readonly nftInfoRepo: Repository<NftInfo>,
    @InjectRepository(NftTransfer) private readonly nftTransferRepo: Repository<NftTransfer>,
    @InjectRepository(TransactionReceipt) private readonly transactionReceiptRepo: Repository<TransactionReceipt>,
    @InjectRepository(TransactionReceiptStatus) private readonly transactionReceiptStatusRepo: Repository<TransactionReceiptStatus>
    ) { }


  async createTransactionReceipt(data: any): Promise<any> {

    let transactionReceipt = new TransactionReceipt();

    transactionReceipt.FunctionArguments = data.functionArguments;

    transactionReceipt.UUId = data.uuid;

    transactionReceipt.Project = data.project;

    transactionReceipt.QueueStatus = data.queueStatus;

    transactionReceipt.TxData = JSON.stringify(data.trxResponse);

    transactionReceipt.FunctionName = data.functionName;

    transactionReceipt.FunctionArgumentsHash = data.functionArgumentsHash;

    transactionReceipt.CreatedBy = data.createdBy;

    transactionReceipt.LastChangedBy = data.lastChangedBy;

    let result = await this.transactionReceiptRepo.save(transactionReceipt);

    return result;
  }

  async createTransactionReceiptStatus(data: any): Promise<any> {

    let transactionReceiptStatus = new TransactionReceiptStatus();

    transactionReceiptStatus.TxHash = data.txHash;

    transactionReceiptStatus.MiningStatus = data.miningStatus;

    transactionReceiptStatus.TransactionReceipt = data.transactionReceipt;

    transactionReceiptStatus.TxFee = data.txFee;

    transactionReceiptStatus.ForwarderNonce = data.forwarderNonce;

    transactionReceiptStatus.GasPriceLevel = data.gasPriceLevel;

    transactionReceiptStatus.GasPriceGwei = data.gasPriceGwei;

    transactionReceiptStatus.CreatedBy = data.createdBy;

    transactionReceiptStatus.LastChangedBy = data.lastChangedBy;

    let result = await this.transactionReceiptStatusRepo.save(transactionReceiptStatus);

    return result;
  }
 
}