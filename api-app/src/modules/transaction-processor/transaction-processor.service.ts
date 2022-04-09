import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import QueueStatus from '../../common/enums/queue-status.enum';
import { CallbackService } from '../../common/callback.module';
import { TxStatus } from '../../common/enums/tx-status.enum';
import { TransactionReceiptStatus } from '../../model/transaction.receipt.status.entity';
import { TxProcessorDBHelperService } from './db-helper.service';
const crypto = require("crypto");

@Injectable()
export class TransactionProcessorService {
  private readonly _callbackService: CallbackService;
  private lastProcessedAt: Date;
  private readonly logger = new Logger(TransactionProcessorService.name);

  constructor(
    callbackService: CallbackService,
    private readonly txProcessorDBHelperService: TxProcessorDBHelperService
  ) {
    this._callbackService = callbackService;

    this.lastProcessedAt = null;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async startProcessTransaction() {
    this.logger.log(`Started processing new transactions at ${new Date()}`);
    const draftTxs = await this.txProcessorDBHelperService.getDraftTransaction();

    this.logger.log(`Found ${draftTxs.length} transaction to process.`);

    for(let i = 0; i < draftTxs.length; i++) {
        const transactionItem = draftTxs[0];
        transactionItem.QueueStatus = QueueStatus.Initialized;

        const txHash = `0x${crypto.randomBytes(30).toString("hex")}`;
        let txReceiptStatus = new TransactionReceiptStatus();
        txReceiptStatus.TxHash = txHash;
        txReceiptStatus.MiningStatus = TxStatus.Pending;
        txReceiptStatus.TransactionReceipt = transactionItem;

        await this.txProcessorDBHelperService.saveTxReceiptStatus(txReceiptStatus, transactionItem.Id);
    }
  }
}
