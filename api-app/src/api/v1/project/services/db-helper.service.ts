import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ProjectType } from '../../../../model/project.type.entity';
import { Project } from '../../../../model/project.entity';
import { Repository } from 'typeorm';
import { SupportProject } from '../../../../model/support.project.entity';
import { TransactionReceipt } from '../../../../model/transaction.receipt.entity';
import { DeleteProjectType, ProjectTypeResponse, SaveProjectType,ProjectResponse,DeleteProject, ProjectFunctionArgumentDTO, FundRaisingDTO, FundRaisingData } from '../dto/project.dto';
import { v4 as uuidv4 } from "uuid";
import { FundRaising } from '../../../../model/fund.raising.entity';
import { TokenDistributionType } from '../../../../model/token.distribution.type.entity';
import { TokenDistribution } from '../../../../model/token.distribution.entity';
import * as moment from "moment";

@Injectable()
export class ProjectDBHelperService {
  private readonly logger = new Logger(ProjectDBHelperService.name);
  constructor(
    @InjectRepository(TransactionReceipt) private readonly transactionReceiptRepo: Repository<TransactionReceipt>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(FundRaising) private readonly fundRisingRepo: Repository<FundRaising>,
    @InjectRepository(TokenDistributionType) private readonly tokenDistributionTypeRepo: Repository<TokenDistributionType>,
    @InjectRepository(TokenDistribution) private readonly tokenDistributionRepo: Repository<TokenDistribution>,
    @InjectRepository(SupportProject) private readonly supportProjectRepo: Repository<SupportProject>,
    
    ) { }


    async getProjectType(): Promise<ProjectTypeResponse[]> {
      this.logger.log(`getProjectType has been initiated.`);
      let result;
      let response: ProjectTypeResponse[] = new Array();
      // try {
      //   result = await this.projectTypeRepo.find();
      //   response = result.map(item => {
      //     return {
      //       name: item.Name,
      //       id: item.Id,
      //       createdDate: item.CreateDate.toString()
      //     }
      //   });
      // } catch(error) {
      //   this.logger.error(error);
      //   throw new BadRequestException('Could not get project type. Something went wrong.');
      // }
  
      this.logger.log(`returning from getProjectType.`);
      return response;
    }


  async saveProjectType(data: SaveProjectType): Promise<ProjectTypeResponse> {
    this.logger.log(`saveProjectType has been initiated.`);
    let response = new ProjectTypeResponse();
    // try {
    //   let newProjectType = new ProjectType();
    //   newProjectType.Name = data.name;
    //   let result = await this.projectTypeRepo.save(newProjectType);
    //   response.name = result.Name;
    //   response.id = result.Id;
    //   response.createdDate = result.CreateDate.toString();
    // } catch(error) {
    //   this.logger.error(error);
    //   throw new BadRequestException('Could not save project type. Something went wrong.');
    // }

    this.logger.log(`returning from saveProjectType.`);
    return response;
  }

  async saveTxReceipt(txReceipt: TransactionReceipt): Promise<any> {
    try {
      let result = await this.transactionReceiptRepo.save(txReceipt);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save tx receipt. Something went wrong.');
    }
  }

  async saveSaveFundrising(fundRising: FundRaising): Promise<any> {
    try {
      let result = await this.fundRisingRepo.save(fundRising);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save fund rising. Something went wrong.');
    }
  }

  async saveTokenDistribution(tokenDistribution: TokenDistribution): Promise<any> {
    try {
      let result = await this.tokenDistributionRepo.save(tokenDistribution);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save token distribution. Something went wrong.');
    }
  }

  async getProject(): Promise<ProjectResponse[]> {
    this.logger.log(`getProject has been initiated.`);
    let result;
    let response: ProjectResponse[] = new Array();
    try {
      result = await this.projectRepo.find({
        relations: ['ProjectType']
      });

      response = result.map(item => {
        return {
          name: item.Name,
          id: item.Id,
          tokenName: item.TokenName,
          tokenSymbol: item.TokenSymbol,
          maxKATTToken: item.maxKATTToken,
          projectTypeId: item.ProjectType.Id,
          createdDate: item.CreateDate.toString()
        }
      });
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not get project. Something went wrong.');
    }

    this.logger.log(`returning from getProject.`);
    return response;
  }

  async getFundRisingProjectId(id: number) {
    const fundRising = await this.fundRisingRepo.findOne({
      where: {
        ProjectId: id
      },
      relations:['ProjectId']
    });
    
    if(!fundRising || !fundRising.Project) {
      throw new BadRequestException(`fundRising not found with projectId: ${id}`);
    }
    return fundRising;
  }


  async checkProjectByWeb2ProjectId(id: number) {
    this.logger.log(`checking project by web2 projectId : ${id}`);
    const project = await this.projectRepo.findOne({
      where: {
        Web2ProjectId: id
      }
    });

    if(!project || !project.Id) {
      throw new BadRequestException(`Invalid project Id`);
    }
    return project
  }

  async checkProjectByTokenName(tokenName: string) {
    this.logger.log(`checking project by tokenName : ${tokenName}`);
    const project = await this.projectRepo.findOne({
      where: {
        TokenName: tokenName
      }
    });
    return project
  }

  async checkProjectBySymbol(symbol: string) {
    this.logger.log(`checking project by symbol : ${symbol}`);
    const project = await this.projectRepo.findOne({
      where: {
        TokenSymbol: symbol
      }
    });
    return project
  }

  async checkExistingProjectByID(id: number) {
    this.logger.log(`checking project by web2 projectId : ${id}`);
    const project = await this.projectRepo.findOne({
      where: {
        Web2ProjectId: id
      }
    });
    return project
  }

  private formateProjectResponse(project: any): ProjectResponse {
    let response = new ProjectResponse();

    response.name = project.Name;
    response.projectId = project.Web2ProjectId;
    response.projectTypeId = project.ProjectTypeId;
    response.tokenName=project.TokenName;
    response.tokenSymbol = project.TokenSymbol;
    response.maxToken = project.maxToken;
    response.votingPower = project.VotingPower;
    response.whoCanVote = project.WhoCanVote;

    response.fundRaising = new FundRaisingDTO();
    response.fundRaising.needed = project.FundRisingNeeded;

    console.log(project.FundRaising[0].StartDate)
    if(response.fundRaising.needed) {
      response.fundRaising.data = new FundRaisingData(); 
      response.fundRaising.data.startDate = moment(project.FundRaising[0].StartDate).format();
      response.fundRaising.data.endDate = moment(project.FundRaising[0].EndDate).format();
      response.fundRaising.data.targetAmount = project.FundRaising[0].TargetAmount;
      response.fundRaising.data.minimumAmount = project.FundRaising[0].MinimumAmount;
      response.fundRaising.data.unit = project.FundRaising[0].Unit;
      response.fundRaising.data.tokenPrice = project.FundRaising[0].TokenPrice;
    }

    return response;
  }
  
  async getProjectDetailsByWeb2ProjectId(id: number) {
    const project = await this.projectRepo.findOne({
      where: {
        Web2ProjectId: id
      },
      relations:['FundRaising', 'TokenDistributionType', 'TokenDistributionType.TokenDistribution']
    });
    
    if(!project || !project.Id) {
      throw new BadRequestException(`Invalid project Id`);
    }

    return project;
  }
  async getOrSaveTokenDistributionType(body:TokenDistributionType) {
    const distributionType = await this.tokenDistributionTypeRepo.findOne({
      where: {
        Project: body.Project.Id,
        Name:body.Name
      },
      relations:['TokenDistribution']
    });
    if(!distributionType || !distributionType.Id|| !distributionType.Name ) {
     let exist_distribution= await this.saveTokenDistributionType(body);
     return exist_distribution;
    }
    return distributionType;
  }


  async getProjectByWeb2ProjectId(id: number) {
    const project = await this.getProjectDetailsByWeb2ProjectId(id);
    return this.formateProjectResponse(project);
  }

  async getAllProject() {
    const projects = await this.projectRepo.find({
      relations:['FundRaising', 'TokenDistributionType', 'TokenDistributionType.TokenDistribution']
    });
    
    if(!projects) {
      throw new BadRequestException(`No Project Found.`);
    }

    let projectList = []
    if(projects.length > 0) {
      projects.forEach(item=> {
        projectList.push(this.formateProjectResponse(item));
      })
    }
    return projectList;
  }

  async saveProject(project: Project): Promise<any> {
    this.logger.log(`SaveProject has been initiated.`);
    let response = new ProjectResponse();
    try {
      let result = await this.projectRepo.save(project);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save project. Something went wrong.');
    }
  }

  async saveSupportProject(supportProject: SupportProject): Promise<any> {
    this.logger.log(`saveSupportProject has been initiated.`);
        try {
      let result = await this.supportProjectRepo.save(supportProject);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save project. Something went wrong.');
    }
  }

  async saveTokenDistributionType(tokenDistributionType: TokenDistributionType): Promise<any> {
    this.logger.log(`saveTokenDistributionType has been initiated.`);
    try {
      let result = await this.tokenDistributionTypeRepo.save(tokenDistributionType);
      return result;
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not save project. Something went wrong.');
    }
    return null;
  }

  async getTokenDistributionByProjectIdAndName(name: string, projectId) {
    let tokenDistributions = await this.tokenDistributionTypeRepo.find({
      where: {
        Name: name
      },
      relations:['Project']
    });

    if(tokenDistributions && tokenDistributions.length > 0) {
      let tokenDistribution = tokenDistributions.find(item => item.Project.Web2ProjectId == projectId);
      return tokenDistribution;
    }

    return null;
  }

  async deleteProject(data: DeleteProject): Promise<any> {
    this.logger.log(`DeleteProject has been initiated.`);

    const project = await this.projectRepo.findOne(data.id);
    if(!project || !project.Name) {
      throw new BadRequestException(`Project type not exists with id: ${data.id}.`);
    }
    try {
      await this.projectRepo.delete(data.id);
    } catch(error) {
      this.logger.error(error);
      throw new BadRequestException('Could not delete project. Something went wrong.');
    }

    this.logger.log(`returning from DeleteProject.`);
    return true;
  }

  public async getDistributionByEOA(eoa: string) {
    const distribution = await this.tokenDistributionRepo.find({
      where: {
        EOA: eoa
      }, 
      relations: ['TokenDistributionType']
    });

    return distribution;
  }

  public async getDistributionTypeByName(name: string, projectId: number) {
    const distribution = await this.tokenDistributionTypeRepo.find({
      where: {
        Name: name
      },
      relations:['Project']
    });

    return distribution;
  }
}