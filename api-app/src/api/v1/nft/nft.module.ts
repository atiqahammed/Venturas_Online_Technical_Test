import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { NftController } from './nft.controller';import { NFTService } from './services/nft.service';
import { CallbackService } from "../../../common/callback.module";
import { TransactionReceipt } from "../../../model/transaction.receipt.entity";
import { NftInfo } from "../../../model/nft.info.entity";
import { NftTransfer } from "../../../model/nft.transfer.entity";
import { Project } from "../../../model/project.entity";
import { TokenDistribution } from "../../../model/token.distribution.entity";
import { FundRaising } from "../../../model/fund.raising.entity";
import { SupportProject } from "../../../model/support.project.entity";
import { TokenDistributionType } from "../../../model/token.distribution.type.entity";
import { CommonValidationService } from "../validation/common";
import { ProjectDBHelperService } from '../../../api/v1/project/services/db-helper.service';
import { NFTBatchDBHelperService } from "./services/db-helper.service";
import { NftValidationService } from "./services/nft.tokenId";



@Module({
  imports:[

    TypeOrmModule.forFeature([TransactionReceipt]),
    TypeOrmModule.forFeature([FundRaising]),
    TypeOrmModule.forFeature([NftInfo]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([NftTransfer]),
    TypeOrmModule.forFeature([TokenDistribution]),
    TypeOrmModule.forFeature([TokenDistributionType]),
    TypeOrmModule.forFeature([SupportProject]),
  ],
  controllers: [NftController],
  providers: [NFTService,CallbackService,ProjectDBHelperService,CommonValidationService,NFTBatchDBHelperService,NftValidationService]
})
export class NftModule {}
