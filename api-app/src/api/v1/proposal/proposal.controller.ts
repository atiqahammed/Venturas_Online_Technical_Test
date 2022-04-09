import {
  Controller,
  Logger,
  Get,
  Post,
  NotFoundException,
  UseGuards,
  Body,
} from "@nestjs/common";
import { ProposalService } from "./services/proposal.service";
import { JwtAuthGuard } from "../../auth/tokenAuth/jwt-auth.guard";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";
import {
  ProposalRequestDto,
  ProposalResponse,
  VoteRequest,
  getProposalRequest,
  VoteResponse,
  getAllProposalRequest,
} from "./dto/proposal.dto";
import { v4 as uuidv4 } from "uuid";
const getProposalResponse = {
  projectId: 1,
  proposalId: 1,
  forVote: 70,
  againstVote: 20,
  abstainVote: 10,
  functionName: "getProposalResult",
  dateTime: "12-12-2012",
  startDate: "12-12-2012",
  endDate: "12-12-2012",
  status: "Continuing", //success/failed
  actionPerformed: "TokenAllocation",
};
import { TxStatus } from "../../../common/enums/tx-status.enum";
const crypto = require("crypto");

@Controller("api/v1")
export class ProposalController {
  private readonly logger = new Logger(ProposalController.name);
  constructor(private service: ProposalService) {}

  @Post("proposals")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to create proposal",
    summary: "proposals",
  })
  public async proposal(@Body() body: ProposalRequestDto): Promise<any> {
    this.logger.log(`proposal has been initiated`);
    let proposalResponse = new ProposalResponse();
    let response = await this.service.queueCreateProposal(body);
    this.logger.log(`proposal has been finished`);
    return response;
  }

  @Post("vote")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to create Vote",
    summary: "vote",
  })
  public async Vote(@Body() body: VoteRequest): Promise<any> {
    this.logger.log(`createVote has been initiated`);
    // const response = await this.service.createVote(body);

    this.logger.log(`returning from createVote`);
    let voteResponse = new VoteResponse();
    voteResponse.txHash = `0x${crypto.randomBytes(30).toString("hex")}`;
    voteResponse.uuid = uuidv4();
    voteResponse.transactionStatus = TxStatus.Pending;    
    let response = await this.service.queueCreateVote(body);
    return response;
    
  }

  @Post("get-proposal-result")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to  Get Proposal Result",
    summary: "get-proposal-result",
  })
  public async getProposalResult(
    @Body() body: getProposalRequest
  ): Promise<any> {
    this.logger.log(`getProposalResult has been initiated`);
    const response = await this.service.getProposalResult(body);
    this.logger.log(`returning from getProposalResult`);
    return response;
  }

  @Post("get-all-proposal-result")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to GET all Proposal Result",
    summary: "get-all-proposal-result",
  })
  public async getAllProposalResult(
    @Body() body: getAllProposalRequest
  ): Promise<any> {
    this.logger.log(`getAllProposalResult has been initiated`);
    return await this.service.getAllproposalByProjectId(body.projectId);
  }
}
