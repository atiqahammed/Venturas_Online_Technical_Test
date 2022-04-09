import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundRaising } from '../../model/fund.raising.entity';
import { Project } from '../../model/project.entity';
import { TokenDistribution } from '../../model/token.distribution.entity';
import { TokenDistributionType } from '../../model/token.distribution.type.entity';
import { TransactionReceipt } from '../../model/transaction.receipt.entity';
import { CallbackService } from '../../common/callback.module';
import { TransactionProcessorService } from './transaction-processor.service';
import { TransactionReceiptStatus } from '../../model/transaction.receipt.status.entity';
import { TxProcessorDBHelperService } from './db-helper.service';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([TransactionReceipt]),
    TypeOrmModule.forFeature([TransactionReceiptStatus]),
    TypeOrmModule.forFeature([FundRaising]),
    TypeOrmModule.forFeature([TokenDistributionType]),
    TypeOrmModule.forFeature([TokenDistribution]),
  ],
  providers: [
    TransactionProcessorService,
    CallbackService,
    TxProcessorDBHelperService
  ],
  exports: [TransactionProcessorService],
})

export class TransactionProcessorModule { }
