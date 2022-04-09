import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../../../model/project.entity";
import { ProjectController } from "./project.controller";
import { ProjectDBHelperService } from "./services/db-helper.service";
import { ProjectService } from "./services/project.service";
import { FundRaising } from "../../../model/fund.raising.entity";
import { TransactionReceipt } from "../../../model/transaction.receipt.entity";
import { CallbackService } from "../../../common/callback.module";
import { CommonValidationService } from "../validation/common";
import { TokenDistributionType } from "../../../model/token.distribution.type.entity";
import { TokenDistribution } from "../../../model/token.distribution.entity";
import { SupportProject } from "../../../model/support.project.entity";
import { BlackListedProposalEOA } from "../../../model/blacklisted.proposal.eoa.entity";



@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([TransactionReceipt]),
    TypeOrmModule.forFeature([FundRaising]),
    TypeOrmModule.forFeature([TokenDistributionType]),
    TypeOrmModule.forFeature([TokenDistribution]),
    TypeOrmModule.forFeature([SupportProject]),
    TypeOrmModule.forFeature([BlackListedProposalEOA]),
  ],
  providers: [
    ProjectDBHelperService,
    ProjectService,
    CallbackService,
    CommonValidationService,
  ],
  controllers: [ProjectController],
  exports: [],
})
export class ProjectModule {}
