import { CacheModule, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CallbackService } from '../../common/callback.module';
import { GraphWatcherService } from './services/graph-watcher.service';
import { GraphWatcherDBHelperService } from './services/db-helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundRaising } from '../../model/fund.raising.entity';
import { Project } from '../../model/project.entity';
import { TokenDistribution } from '../../model/token.distribution.entity';
import { TokenDistributionType } from '../../model/token.distribution.type.entity';
import { Proposal } from '../../model/proposal.entity';
import { Vote } from '../../model/vote.entity';
import { SupportProject } from '../../model/support.project.entity';
import { TransactionReceipt } from '../../model/transaction.receipt.entity';
import { CallbackRequest } from '../../model/callback.request.entity';
import { TransactionReceiptStatus } from '../../model/transaction.receipt.status.entity';
import { ProjectDBHelperService } from '../../api/v1/project/services/db-helper.service';
import { ProposalDBHelperService } from '../../api/v1/proposal/services/db-helper.service';
import { BlackListedProposalEOA } from '../../model/blacklisted.proposal.eoa.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([TransactionReceipt]),
    TypeOrmModule.forFeature([TransactionReceiptStatus]),
    TypeOrmModule.forFeature([FundRaising]),
    TypeOrmModule.forFeature([TokenDistributionType]),
    TypeOrmModule.forFeature([TokenDistribution]),
    TypeOrmModule.forFeature([Proposal]),
    TypeOrmModule.forFeature([Vote]),
    TypeOrmModule.forFeature([SupportProject]),
    TypeOrmModule.forFeature([CallbackRequest]),
    TypeOrmModule.forFeature([BlackListedProposalEOA]),
    
  ],
  exports: [GraphWatcherService],
  providers: [GraphWatcherService, CallbackService, GraphWatcherDBHelperService, ProposalDBHelperService,ProjectDBHelperService],
})
export class GraphWatcherModule implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) { }
  onModuleInit(): void {
    const service: GraphWatcherService = this.moduleRef.get(
      GraphWatcherService
    );
    service.start();
  }
}
