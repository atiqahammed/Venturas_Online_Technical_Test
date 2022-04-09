import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Proposal } from "../../../model/proposal.entity";
import { Project } from "../../../model/project.entity";
import { Vote } from "../../../model/vote.entity";
import { ProposalController } from "./proposal.controller";
import { CommonValidationService } from "../validation/common";
import { TransactionReceipt } from "../../../model/transaction.receipt.entity";
import { ProposalService } from "./services/proposal.service";
import { CallbackService } from "../../../common/callback.module";
import { ProposalDBHelperService } from "./services/db-helper.service";
import { BlackListedProposalEOA } from "../../../model/blacklisted.proposal.eoa.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal]),
    TypeOrmModule.forFeature([TransactionReceipt]),
    TypeOrmModule.forFeature([Project]),
    TypeOrmModule.forFeature([Vote]),
    TypeOrmModule.forFeature([BlackListedProposalEOA]),
  ],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    CallbackService,
    ProposalDBHelperService,
    CommonValidationService,
  ],
})
export class ProposalModule {}
