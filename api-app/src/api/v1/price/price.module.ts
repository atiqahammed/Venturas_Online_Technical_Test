import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../../model/project.entity';
import { NftInfo } from '../../../model/nft.info.entity';
import { NftTransfer } from '../../../model/nft.transfer.entity';
import { TransactionReceipt } from '../../../model/transaction.receipt.entity';
import { TransactionReceiptStatus } from '../../../model/transaction.receipt.status.entity';
import { PriceController } from './price.controller';
import { PriceDBHelperService } from './services/db-helper.service';
import { PriceBlockChainService } from './services/price-blockchain.service';
import { PriceService } from './services/price.service';
import { AuthService } from '../../auth/tokenAuth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/headerAuth/auth.module';
import { TokenAuthModule } from '../../auth/tokenAuth/auth.module';
import { CommonCacheModule } from '../../../common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]), 
    TypeOrmModule.forFeature([NftInfo]), 
    TypeOrmModule.forFeature([NftTransfer]), 
    TypeOrmModule.forFeature([TransactionReceipt]), 
    TypeOrmModule.forFeature([TransactionReceiptStatus]),
    AuthModule, TokenAuthModule, CommonCacheModule
  ],
  providers: [
    PriceService,
    PriceBlockChainService,
    PriceDBHelperService,
    AuthService,
    JwtModule
  ],
  controllers: [PriceController],
  exports: []
})
export class PriceModule { }