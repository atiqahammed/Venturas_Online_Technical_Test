import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "../../../../model/user.type.entity";
import { Project } from "../../../../model/project.entity";
import { Repository } from "typeorm";
import { TransactionReceipt } from "../../../../model/transaction.receipt.entity";
import { Proposal } from "../../../../model/proposal.entity";
import { Vote } from "../../../../model/vote.entity";
import * as bcrypt from "bcrypt";
import { resolve } from "path/posix";
import { getProposalRequest ,getProposalResponse} from "../dto/proposal.dto";
import * as moment from "moment";
import { BlackListedProposalEOA } from "../../../../model/blacklisted.proposal.eoa.entity";


@Injectable()
export class ProposalDBHelperService {
  private readonly logger = new Logger(ProposalDBHelperService.name);
  constructor(
    @InjectRepository(TransactionReceipt)
    private readonly transactionReceiptRepo: Repository<TransactionReceipt>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
    @InjectRepository(BlackListedProposalEOA)
    private readonly blackListedEOARepo: Repository<BlackListedProposalEOA>
  ) {}

  async saveTxReceipt(txReceipt: TransactionReceipt): Promise<any> {
    try {
      let result = await this.transactionReceiptRepo.save(txReceipt);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not save tx receipt. Something went wrong."
      );
    }
  }

  async saveBlackListedEOA(item: BlackListedProposalEOA) {
    try {
      await this.blackListedEOARepo.save(item);
    } catch(error) {
      this.logger.log(error);
    }
  }

  async saveProposal(proposal: Proposal): Promise<any> {
    this.logger.log(`SaveProposal has been initiated.`);
    try {
      let result = await this.proposalRepo.save(proposal);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not save proposal. Something went wrong."
      );
    }
  }
  async saveVote(vote: Vote): Promise<any> {
    this.logger.log(`saveVote has been initiated.`);
    try {
      let result = await this.voteRepo.save(vote);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not save Vote. Something went wrong."
      );
    }
  }

  async checkProjectByWeb2ProjectId(id: number) {
    this.logger.log(`checking project by web2 projectId : ${id}`);
    const project = await this.projectRepo.findOne({
      where: {
        Web2ProjectId: id,
      },
    });

    if (!project || !project.Id) {
      throw new BadRequestException(`Invalid project Id`);
    }
    return project;
  }
  async checkProposalById(id: number) {
    this.logger.log(`checking proposal by Id : ${id}`);
    const proposal = await this.proposalRepo.findOne({
      where: {
        Id: id,
      },
    });

    if (!proposal || !proposal.Id) {
      throw new BadRequestException(`Invalid proposal Id`);
    }
    return proposal;
  }

  async isDuplicateProposalId(Web2ProposalId, Web2ProjectId) {
    
    let proposals = await this.proposalRepo.find({
      where: {
        Web2ProposalId: Web2ProposalId
      },
      relations: ['Project']
    });
    
    if(proposals && proposals.length > 0) {
      let proposal = proposals.find(item => item.Project.Web2ProjectId == Web2ProjectId);
      if(proposal) {
        return true;
      }
    }

    return false;
  }

  async formatProposalResponse(proposal: any){
    const proposalResponse= new getProposalResponse();
    proposalResponse.projectId=proposal.Project.Web2ProjectId,
    proposalResponse.proposalId=proposal.Web2ProposalId,
    proposalResponse.forVote=70,
    proposalResponse.againstVote=10,
    proposalResponse.abstainVote=10,
    proposalResponse.status="Continuing",
    proposalResponse.actionPerformed=proposal.Action;
    proposalResponse.startDate = moment(proposal.CreateDate).format();
    proposalResponse.endDate = moment(proposal.ExpiryDate).format()
    proposalResponse.dateTime = moment(proposal.ActionPerformDate).format()

    return proposalResponse;

  }

  async getAllProposalResult(projectId: number) {
    const proposals = await this.proposalRepo.find({
      relations: ["BlackListedProposalEOA", 'Project'],
    });

    if (!proposals) {
      return {
        projectId,
        functionName: "getProposals",
        proposals: [] 
      }
    }

    let selectedProposal = proposals.filter(item => item.Project.Web2ProjectId == projectId);
    if(selectedProposal.length <= 0) {
      return {
        projectId,
        functionName: "getProposals",
        proposals: [] 
      }
    }

    let responseProposals = [];
    for(let i = 0; i <selectedProposal.length; i++) {
      const proposal = selectedProposal[i];
      const response = await this.formatProposalResponse(proposal);
      responseProposals.push(response);
    }

    return {
        projectId,
        functionName: "getProposals",
        proposals: responseProposals
      };
  }

  async getProposalResult(body: getProposalRequest) {
    const proposal = await this.proposalRepo.findOne({
      where: {
        Id: body.proposalId,
        GroupId: body.groupId,
        Project: body.projectId,
      },
      relations: ["BlackListedProposalEOA", 'Project'],
    });

    if (!proposal || !proposal.Id) {
      throw new BadRequestException(`Invalid proposalId`);
    }

    const response=await this.formatProposalResponse(proposal);
    response.functionName = "getProposalResult"
    return response;
  }
}
