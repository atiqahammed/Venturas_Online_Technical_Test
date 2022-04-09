import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CallbackService } from "../../../../common/callback.module";
import { FunctionNames } from "../../../../common/enums/function-names.enum";
import { CommonValidationService } from "../../validation/common";
import { TxStatus } from "../../../../common/enums/tx-status.enum";
import { v4 as uuidv4 } from "uuid";
import { ProposalDBHelperService } from "./db-helper.service";
import { Proposal } from "../../../../model/proposal.entity";
import { Vote } from "../../../../model/vote.entity";
import QueueStatus from "../../../../common/enums/queue-status.enum";
import {
  getProposalRequest,
  ProposalRequestDto,
  ProposalFunctionArgumentDTO,
  createProposalResponseDto,VoteRequest,VoteFunctionArgumentDTO
} from "../dto/proposal.dto";
import { CommonParameter } from "../../../../common/dto/common-parameter.dto";
import { TransactionReceipt } from "../../../../model/transaction.receipt.entity";
import { Project } from "src/model/project.entity";
import { BlackListedProposalEOA } from "../../../../model/blacklisted.proposal.eoa.entity";
const crypto = require("crypto");

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);
  private mockProjectList = new Array();
  private readonly _callbackService: CallbackService;
  private readonly network = process.env.NETWORK || "ganache";

  constructor(
    callbackService: CallbackService,
    private dbHelperService: ProposalDBHelperService,
    private readonly validationService: CommonValidationService
  ) {
    this._callbackService = callbackService;
  }

  private getProposalFunctionArgument(
    createProposalDto: ProposalRequestDto
  ): ProposalFunctionArgumentDTO {
    let proposalFunctionArgument = new ProposalFunctionArgumentDTO();
    let proposalDto = new ProposalRequestDto();
    proposalDto.projectId = createProposalDto.projectId;
    proposalDto.groupId = createProposalDto.groupId;
    proposalDto.proposalId = createProposalDto.proposalId;
    proposalDto.proposalType = createProposalDto.proposalType;
    proposalDto.proposalText = createProposalDto.proposalText;
    proposalDto.action = createProposalDto.action;
    proposalDto.minimumThreshold = createProposalDto.minimumThreshold;
    proposalDto.expiryDate = createProposalDto.expiryDate;
    proposalDto.actionPerformDate = createProposalDto.actionPerformDate;
    proposalDto.instantTrigger = createProposalDto.instantTrigger;
    proposalDto.data = createProposalDto.data;
    proposalDto.blacklistedEOA = createProposalDto.blacklistedEOA && createProposalDto.blacklistedEOA.length > 0 ? createProposalDto.blacklistedEOA.sort(): [];
    proposalFunctionArgument.functionName = FunctionNames.Proposal;
    proposalFunctionArgument.functionArgument = proposalDto;

    return proposalFunctionArgument;
  }
 

  public async queueCreateProposal(
    createProposalDto: ProposalRequestDto
  ): Promise<any> {
    let proposalFunctionArgument = this.getProposalFunctionArgument(createProposalDto);

    const project = await this.dbHelperService.checkProjectByWeb2ProjectId(
      proposalFunctionArgument.functionArgument.projectId
    );

    const isDuplicateProposalId = await this.dbHelperService.isDuplicateProposalId(createProposalDto.proposalId, createProposalDto.projectId);
    if(isDuplicateProposalId) {
      throw new BadRequestException(`Duplicate Proposal ID.`);
    }

    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.Proposal;
    txReceipt.FunctionArguments = JSON.stringify(proposalFunctionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(
      proposalFunctionArgument
    );
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;

    await this.dbHelperService.saveTxReceipt(txReceipt);
    
    let proposal = new Proposal();
    proposal.Project = project;
    proposal.GroupId = proposalFunctionArgument.functionArgument.groupId;
    proposal.ProposalType =
      proposalFunctionArgument.functionArgument.proposalType;
    proposal.ProposalText =
      proposalFunctionArgument.functionArgument.proposalText;
    proposal.Action = proposalFunctionArgument.functionArgument.action;
    proposal.MinimumThreshold =
      proposalFunctionArgument.functionArgument.minimumThreshold;
    proposal.ExpiryDate = proposalFunctionArgument.functionArgument.expiryDate;
    proposal.ActionPerformDate =
      proposalFunctionArgument.functionArgument.actionPerformDate;
    proposal.InstantTrigger =
      proposalFunctionArgument.functionArgument.instantTrigger;
    proposal.Data = proposalFunctionArgument.functionArgument.data;
    proposal.Web2ProposalId = proposalFunctionArgument.functionArgument.proposalId;

    const proposalResult = await this.dbHelperService.saveProposal(proposal);

    if(proposalFunctionArgument.functionArgument.blacklistedEOA && proposalFunctionArgument.functionArgument.blacklistedEOA.length > 0) {
      for(let i = 0; i < proposalFunctionArgument.functionArgument.blacklistedEOA.length; i++) {
        let blackListedProposalEOA = new BlackListedProposalEOA();
        blackListedProposalEOA.EOA = proposalFunctionArgument.functionArgument.blacklistedEOA[i];
        blackListedProposalEOA.Proposal = proposalResult;
        await this.dbHelperService.saveBlackListedEOA(blackListedProposalEOA);
      }
    }

    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.transactionStatus = TxStatus.Pending;
    response.functionName = txReceipt.FunctionName;
    return response;
  }

  private getVoteFunctionArgument(
    createVoteDto: VoteRequest
  ): VoteFunctionArgumentDTO {
    let voteFunctionArgument = new VoteFunctionArgumentDTO();
    let voteDto = new VoteRequest();
    voteDto.projectId = createVoteDto.projectId;
    voteDto.groupId = createVoteDto.groupId;
    voteDto.proposalId = createVoteDto.proposalId;
    voteDto.eoa = createVoteDto.eoa;
    voteDto.vote = createVoteDto.vote;
    voteDto.date = createVoteDto.date;

    voteFunctionArgument.functionName = FunctionNames.Vote;
    voteFunctionArgument.functionArgument = voteDto;

    return voteFunctionArgument;
  }

  public async queueCreateVote(
    createVoteDto: VoteRequest
  ): Promise<any> {
    
    let voteFunctionArgument = this.getVoteFunctionArgument(createVoteDto);

    const project = await this.dbHelperService.checkProjectByWeb2ProjectId(
      voteFunctionArgument.functionArgument.projectId
    );
    const proposal = await this.dbHelperService.checkProposalById(
      voteFunctionArgument.functionArgument.proposalId
    );
    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.Vote;
    txReceipt.FunctionArguments = JSON.stringify(voteFunctionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(
      voteFunctionArgument
    );
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;

    await this.dbHelperService.saveTxReceipt(txReceipt);
    let vote = new Vote();
    vote.Proposal=proposal;
    vote.Project=project;
    vote.GroupId=voteFunctionArgument.functionArgument.groupId;
    vote.EOA=voteFunctionArgument.functionArgument.eoa;
    vote.Vote=voteFunctionArgument.functionArgument.vote;
    vote.Date=voteFunctionArgument.functionArgument.date;

    await this.dbHelperService.saveVote(vote);

    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.transactionStatus = TxStatus.Pending;
    response.functionName = txReceipt.FunctionName;

    return response;
  }

  public async getProposalResult(dto: getProposalRequest): Promise<any> {
    this.logger.log("getProposalResult has been initiated.");
    const project = await this.dbHelperService.checkProjectByWeb2ProjectId(
      dto.projectId
    );
    const proposal = await this.dbHelperService.getProposalResult(dto);
    this.logger.log("Returning from getProposalResult.");
    return proposal;
  }

  public async getAllproposalByProjectId(projectId: number) {
    const project = await this.dbHelperService.checkProjectByWeb2ProjectId(
      projectId
    );

    return await this.dbHelperService.getAllProposalResult(projectId);
  }

  public async saveMockVote(dto: any, body: any): Promise<any> {
    this.logger.log("saveMockVote has been initiated.");
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const projectItem = { uuid: dto.uuid, projectId: body.projectId };
    const mockCallbackFunctionName = FunctionNames.Vote;

    let callbackPayload = {
      projectId: projectItem.projectId,
      functionName: mockCallbackFunctionName,
      status: "success",
      messages: ["Success"],
      data: {
        transactionStatus: TxStatus.Mined,
        transactionHash: dto.txHash,
        uuid: projectItem.uuid,
      },
    };

    let callbackUrl = "web3callback";

    try {
      if (callbackUrl !== "") {
        this.logger.log(`Sending call back to: ${callbackUrl}`);
        await delay(5000);
        await this._callbackService.callback(
          callbackPayload,
          callbackUrl,
          false
        );
      }
    } catch (error) {
      this.logger.error(error);
    }

    this.logger.log("saveMockVote from saveProject.");
    return true;
  }
}
