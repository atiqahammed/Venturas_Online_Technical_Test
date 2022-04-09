import { BadRequestException, Injectable, Logger,NotFoundException } from "@nestjs/common";
import { Project } from "../../../../model/project.entity";
import { TxStatus } from "../../../../common/enums/tx-status.enum";
import { FunctionNames } from "../../../../common/enums/function-names.enum";
import { v4 as uuidv4 } from "uuid";
import QueueStatus from "../../../../common/enums/queue-status.enum";
import { ethers } from "ethers";
import { TransactionReceipt } from '../../../../model/transaction.receipt.entity';
import { SupportProject } from '../../../../model/support.project.entity';
import {SupportProjectFunctionArgumentDTO,CreateSupportProjectDTO,
  DeleteProject,
  ProjectTypeResponse,
  SaveProjectType,getProjectByIdRequest,TokenTypes, CreateProjectRequestDTO, ProjectFunctionArgumentDTO, FundRaisingDTO, FundRaisingData, TokenAllocationDTO, TokenAllocationBreakdownDTO, TokenDistributionDTO, EoAPercent, TokenAllocationFunactionArgumentDTO, AllocationBreakdownFunctionArgumentDTO, CreateProjectTokenAllocationDTO
} from "../dto/project.dto";
import { ProjectDBHelperService } from "./db-helper.service";
import { CallbackService } from "../../../../common/callback.module";
import { CommonValidationService } from "../../validation/common";
import { FundRaising } from "../../../../model/fund.raising.entity";
import { TokenDistributionType } from "../../../../model/token.distribution.type.entity";
import { TokenDistribution } from "../../../../model/token.distribution.entity";
import { CommonParameter } from "../../../../common/dto/common-parameter.dto";
import { GetContractAddressResponseDTO } from "../dto/contract-address.dto";
const crypto = require("crypto");

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  private readonly _callbackService: CallbackService;
  private readonly network = process.env.NETWORK || 'ganache';

  constructor(
    private dbHelperService: ProjectDBHelperService,
    callbackService: CallbackService,
    private readonly validationService: CommonValidationService
  ) {
    this._callbackService = callbackService;
  }

  public async saveProjectType(
    dto: SaveProjectType
  ): Promise<ProjectTypeResponse> {
    this.logger.log("saveProjectType has been initiated.");
    const response = await this.dbHelperService.saveProjectType(dto);
    this.logger.log("Returning from saveProjectType.");
    return response;
  }

  public async getProjectType(): Promise<any> {
    this.logger.log("getProjectType has been initiated.");
    const response = await this.dbHelperService.getProjectType();
    this.logger.log("Returning from getProjectType.");
    return response;
  }

  public async saveProject(dto: any): Promise<any> {
    this.logger.log("saveProject has been initiated.");
    const response = await this.dbHelperService.saveProject(dto);
    this.logger.log("Returning from saveProject.");
    return response;
  }

  private sortEOAvsTokenDistribution(distributionItems: EoAPercent[]): EoAPercent[] {
    let itemsToSort = distributionItems;
    itemsToSort.sort((item1, item2) => {
      if(item1.eoa > item2.eoa){
        return 1;
      } 
      if(item1.eoa < item2.eoa) {
        return -1;
      }
      return 0;
    })
    return itemsToSort;
  } 

  

  private getSortedAllocationDistribution(tokenDistribution: TokenDistributionDTO[]): TokenDistributionDTO[] {
    const sorted_distribution= tokenDistribution.sort((item1, item2) => {
      if(item1['name'] > item2['name']) return 1;
      if(item1['name'] < item2['name']) return -1;
      return 0;
    });
    let sortedTokenDistribution=[];
    if (tokenDistribution.length>0){
      for (let i = 0; i < sorted_distribution.length; i++) {
        let token_distribution=new TokenDistributionDTO();
        token_distribution.eoa=sorted_distribution[i].eoa;
        token_distribution.percent=sorted_distribution[i].percent;
        token_distribution.name=sorted_distribution[i].name;
        sortedTokenDistribution.push(token_distribution);
      }  
    }      
    return sortedTokenDistribution;
  }


  private getSortedTokenAllocationTokenTypes(tokenTypes: TokenTypes[]): TokenTypes[] {
    const sorted_attribute= tokenTypes.sort((item1, item2) => {
      if(item1['name'] > item2['name']) return 1;
      if(item1['name'] < item2['name']) return -1;
      return 0;
    });
    let sortedTokenTypes=[];
    if (tokenTypes.length>0){
      for (let i = 0; i < sorted_attribute.length; i++) {
        let token_types = new TokenTypes();
        token_types.name = sorted_attribute[i].name;
        token_types.allocation = sorted_attribute[i].allocation;
        token_types.fundStartDate = sorted_attribute[i].fundStartDate;
        token_types.fundEndDate = sorted_attribute[i].fundEndDate;
        token_types.fundTargetAmount = sorted_attribute[i].fundTargetAmount;
        token_types.fundMinimumAmount = sorted_attribute[i].fundMinimumAmount;
        token_types.fundTokenPrice = sorted_attribute[i].fundTokenPrice;
        token_types.fundUnit = sorted_attribute[i].fundUnit;
        token_types.type = sorted_attribute[i].type;

        sortedTokenTypes.push(token_types);
      }  
    }      
    return sortedTokenTypes;
  }

  private getProjectFunctionArgument(createProjectDTO: CreateProjectRequestDTO): ProjectFunctionArgumentDTO {
    let projectFunctionArgument = new ProjectFunctionArgumentDTO();
    
    let projectDto = new CreateProjectRequestDTO();
    projectDto.name = createProjectDTO.name;
    projectDto.projectId = createProjectDTO.projectId;
    projectDto.projectTypeId = createProjectDTO.projectTypeId;
    projectDto.tokenName = createProjectDTO.tokenName;
    projectDto.tokenSymbol = createProjectDTO.tokenSymbol;
    projectDto.maxToken = createProjectDTO.maxToken;
    projectDto.votingPower = createProjectDTO.votingPower;
    projectDto.whoCanVote = createProjectDTO.whoCanVote;

    if(createProjectDTO.fundRaising) {
      let fundRaising = new FundRaisingDTO();
      fundRaising.needed = createProjectDTO.fundRaising.needed;
      if(fundRaising.needed && createProjectDTO.fundRaising.data) {
        let fundRaisingData = new FundRaisingData();
        fundRaisingData.startDate = createProjectDTO.fundRaising.data.startDate;
        fundRaisingData.endDate = createProjectDTO.fundRaising.data.endDate;
        fundRaisingData.targetAmount = createProjectDTO.fundRaising.data.targetAmount;
        fundRaisingData.minimumAmount = createProjectDTO.fundRaising.data.minimumAmount;
        fundRaisingData.unit = createProjectDTO.fundRaising.data.unit;
        fundRaisingData.tokenPrice = createProjectDTO.fundRaising.data.tokenPrice;

        fundRaising.data = fundRaisingData;
      }
      projectDto.fundRaising = fundRaising;
    }

    if(createProjectDTO.tokenAllocation) {
      let tokenAllocation = new CreateProjectTokenAllocationDTO();

      if(createProjectDTO.tokenAllocation.tokenTypes) {
        let tokenTypes = this.getSortedTokenAllocationTokenTypes(createProjectDTO.tokenAllocation.tokenTypes);
        tokenAllocation.tokenTypes = tokenTypes;  
      }      
      tokenAllocation.calculateby = createProjectDTO.tokenAllocation.calculateby; 

      projectDto.tokenAllocation = tokenAllocation;
    }

    if(createProjectDTO.tokenDistribution) {
      let tokenDistribution = this.getSortedAllocationDistribution(createProjectDTO.tokenDistribution);
      projectDto.tokenDistribution = tokenDistribution;
    }

    projectFunctionArgument.functionName = FunctionNames.CreateProject;
    projectFunctionArgument.functionArgument = projectDto;

    return projectFunctionArgument;
  }

  private async validateProject(createProjectDTO: CreateProjectRequestDTO) {
    let existingProject = await this.dbHelperService.checkExistingProjectByID(createProjectDTO.projectId);
    if(existingProject) {
      throw new BadRequestException(`Invalid project Id`);
    }

    existingProject = await this.dbHelperService.checkProjectByTokenName(createProjectDTO.tokenName);
    if(existingProject) {
      throw new BadRequestException(`Project already exist with tokenName: ${createProjectDTO.tokenName}`);
    }

    existingProject = await this.dbHelperService.checkProjectBySymbol(createProjectDTO.tokenSymbol);
    if(existingProject) {
      throw new BadRequestException(`Project already exist with tokenSymbol: ${createProjectDTO.tokenSymbol}`);
    }
  }

  public async queueCreateProject(createProjectDTO: CreateProjectRequestDTO): Promise<CommonParameter> {
    await this.validateProject(createProjectDTO);
    let projectFunctionArgument = this.getProjectFunctionArgument(createProjectDTO);
    
    
    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.CreateProject;
    txReceipt.FunctionArguments = JSON.stringify(projectFunctionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(projectFunctionArgument);
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;

    await this.dbHelperService.saveTxReceipt(txReceipt);

    let project = new Project();
    project.Name = projectFunctionArgument.functionArgument.name;
    project.Web2ProjectId = projectFunctionArgument.functionArgument.projectId;
    project.ProjectTypeId = projectFunctionArgument.functionArgument.projectTypeId;
    project.TokenName = projectFunctionArgument.functionArgument.tokenName;
    project.TokenSymbol = projectFunctionArgument.functionArgument.tokenSymbol;
    project.maxToken = projectFunctionArgument.functionArgument.maxToken;
    project.VotingPower = projectFunctionArgument.functionArgument.votingPower;
    project.WhoCanVote = projectFunctionArgument.functionArgument.whoCanVote;
    project.ContractAddress = `0x${crypto.randomBytes(30).toString("hex")}`;
    project.FundRisingNeeded = projectFunctionArgument.functionArgument.fundRaising.needed;
    project.Status = 1;
    project.deploymentStep = 0;

    const projectResult = await this.dbHelperService.saveProject(project);
    

    if(project.FundRisingNeeded && projectFunctionArgument.functionArgument.fundRaising.data) {
      let fundRaising = new FundRaising();
      fundRaising.Project = projectResult;
      fundRaising.TokenPrice = projectFunctionArgument.functionArgument.fundRaising.data.tokenPrice;
      fundRaising.TargetAmount = projectFunctionArgument.functionArgument.fundRaising.data.targetAmount;
      fundRaising.MinimumAmount = projectFunctionArgument.functionArgument.fundRaising.data.minimumAmount;
      fundRaising.Unit = projectFunctionArgument.functionArgument.fundRaising.data.unit;
      fundRaising.StartDate = new Date(projectFunctionArgument.functionArgument.fundRaising.data.startDate);
      fundRaising.EndDate = new Date(projectFunctionArgument.functionArgument.fundRaising.data.endDate);
      await this.dbHelperService.saveSaveFundrising(fundRaising);
    }


    if(projectFunctionArgument.functionArgument.tokenAllocation && projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes.length > 0) {
      for(let i = 0; i < projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes.length; i++) {
        let tokenDistributionType = new TokenDistributionType();
        tokenDistributionType.Project = projectResult;
        tokenDistributionType.Name = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].name;
        tokenDistributionType.Allocation = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].allocation;

        tokenDistributionType.Type = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].type;
        tokenDistributionType.FundStartDate = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].fundStartDate;
        tokenDistributionType.FundEndDate = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].fundEndDate;
        tokenDistributionType.FundTargetAmount = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].fundTargetAmount;
        tokenDistributionType.FundMinimumAmount = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].fundMinimumAmount;
        tokenDistributionType.FundUnit = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].fundUnit;
        tokenDistributionType.FundTokenPrice = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].fundTokenPrice;
  
        tokenDistributionType.CalculatedBy = projectFunctionArgument.functionArgument.tokenAllocation.calculateby;
        await this.dbHelperService.saveTokenDistributionType(tokenDistributionType);
      }
    }

    if(projectFunctionArgument.functionArgument.tokenDistribution && projectFunctionArgument.functionArgument.tokenDistribution.length > 0) {
      for(let i = 0; i < projectFunctionArgument.functionArgument.tokenDistribution.length; i++) {
        let distributionItem = projectFunctionArgument.functionArgument.tokenDistribution[i];
        let tokenDistribution = new TokenDistribution();

        let tokendistributionType = await this.dbHelperService.getTokenDistributionByProjectIdAndName(distributionItem.name, projectResult.Web2ProjectId);
        if(!tokenDistribution) {
          let tokenDistributionType = new TokenDistributionType();
          tokenDistributionType.Project = projectResult;
          tokenDistributionType.Name = distributionItem.name;
          tokenDistributionType.Allocation = 0;
          tokenDistributionType.CalculatedBy = projectFunctionArgument.functionArgument.tokenAllocation.calculateby;
          tokendistributionType = await this.dbHelperService.saveTokenDistributionType(tokenDistributionType);
        }

        tokenDistribution.CalculatedBy = tokendistributionType.CalculatedBy;
        tokenDistribution.EOA = distributionItem.eoa;
        tokenDistribution.Project = projectResult;
        tokenDistribution.TokenDistributionType = tokendistributionType;
        tokenDistribution.Percent = distributionItem.percent;
        await this.dbHelperService.saveTokenDistribution(tokenDistribution);
      }
    }

    // if(projectFunctionArgument.functionArgument.tokenAllocation) {
    //   const itemLength = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes.length;

    //   for (let i = 0; i < itemLength; i++) {

    //     const tokenDistributionType = new TokenDistributionType();
    //     tokenDistributionType.Project = projectResult;
    //     tokenDistributionType.Name = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].name;
    //     tokenDistributionType.Allocation = projectFunctionArgument.functionArgument.tokenAllocation.tokenTypes[i].allocation;
    //     tokenDistributionType.CalculatedBy = projectFunctionArgument.functionArgument.tokenAllocation.calculateby;
    //     const distributionTypeResult= await this.dbHelperService.getOrSaveTokenDistributionType(tokenDistributionType);
        
    //     if(projectFunctionArgument.functionArgument.tokenDistribution) {
    //       const itemLength = projectFunctionArgument.functionArgument.tokenDistribution.length;

    //       for(let i=0; i <itemLength; i++) {
    //         const item = projectFunctionArgument.functionArgument.tokenDistribution[i];
    //         let tokenDistribution = new TokenDistribution();
    //         tokenDistribution.Project = projectResult;
    //         tokenDistribution.TokenDistributionType = distributionTypeResult;
    //         tokenDistribution.CalculatedBy = tokenDistributionType.CalculatedBy;
    //         tokenDistribution.EOA = item.eoa;
    //         tokenDistribution.Percent = item.percent;
    //         await this.dbHelperService.saveTokenDistribution(tokenDistribution);
    //       }
    //     }
    //   }     

    //   }

          
    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.functionName = txReceipt.FunctionName;
    response.functionName = txReceipt.FunctionName;
    response.transactionStatus = TxStatus.Pending;

    return response;
  }

  public async getContractAddressByProject(web2ProjectId: number) {
    const project = await this.dbHelperService.getProjectDetailsByWeb2ProjectId(web2ProjectId);
    // const response = await this.service.deleteProject(body);
    let contractAddressResponse = new GetContractAddressResponseDTO();
    contractAddressResponse.contractAddress = project.ContractAddress;
    return contractAddressResponse;
  }

  private getAllocationBreakdownFunctionArgument(allocationData: TokenAllocationBreakdownDTO): AllocationBreakdownFunctionArgumentDTO {
    let functionArgument = new AllocationBreakdownFunctionArgumentDTO();
    functionArgument.functionName = FunctionNames.AllocationBreakdown;

    let data = new TokenAllocationBreakdownDTO();
    data.projectId = allocationData.projectId;
    data.distribution = this.getSortedAllocationDistribution(allocationData.distribution);
    functionArgument.functionArgument = data;
    return functionArgument;
  }

  public async queueAllocationBreakdown(allocationData: TokenAllocationBreakdownDTO): Promise<CommonParameter> {
    this.logger.log(`queueAllocationBreakdown has been initiated`);
    const project = await this.dbHelperService.checkProjectByWeb2ProjectId(allocationData.projectId);
    const functionArgument = this.getAllocationBreakdownFunctionArgument(allocationData);
    
    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.AllocationBreakdown;
    txReceipt.FunctionArguments = JSON.stringify(functionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(functionArgument);
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;

    await this.dbHelperService.saveTxReceipt(txReceipt);

    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.functionName = txReceipt.FunctionName;

    return response;
  }

  public async queueTokenAllocation(allocationDTO: TokenAllocationDTO) {
    let tokenAllocationFuntionArgument = new TokenAllocationFunactionArgumentDTO();
    tokenAllocationFuntionArgument.functionName = FunctionNames.TokenAllocation;

    let allocation = new TokenAllocationDTO();
    allocation.projectId = allocationDTO.projectId;
    allocation.calculateby = allocationDTO.calculateby;
    allocation.tokenTypes = await this.getSortedTokenAllocationTokenTypes(allocationDTO.tokenTypes);
    let allocationSum = allocation.tokenTypes.reduce(function (accumulator, item) {
      return accumulator + item.allocation;
    }, 0);
    if (!(allocationSum === 100)) {
      throw new NotFoundException("the sum of allocations should be 100%");
    }
    tokenAllocationFuntionArgument.functionArgument = allocation;

    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.TokenAllocation;
    txReceipt.FunctionArguments = JSON.stringify(tokenAllocationFuntionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(tokenAllocationFuntionArgument);
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;

    await this.dbHelperService.saveTxReceipt(txReceipt);

    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.functionName = txReceipt.FunctionName;

    return response;
  }


  public async queueCreateSupportProject(supportProjectDTO: CreateSupportProjectDTO) {
    const project = await this.dbHelperService.checkProjectByWeb2ProjectId(supportProjectDTO.projectId);
    let supportProjectFuntionArgument = new SupportProjectFunctionArgumentDTO();
    supportProjectFuntionArgument.functionName = FunctionNames.TokenAllocation;

    let supportProject = new CreateSupportProjectDTO();
    supportProject.amount = supportProjectDTO.amount;
    supportProject.eoa = supportProjectDTO.eoa;
    supportProject.unit = supportProjectDTO.unit;
    supportProject.date = supportProjectDTO.date;
    supportProject.projectId = supportProjectDTO.projectId;

    supportProjectFuntionArgument.functionArgument = supportProject;

    let txReceipt = new TransactionReceipt();
    txReceipt.UUId = uuidv4();
    txReceipt.FunctionName = FunctionNames.SupportProject;
    txReceipt.FunctionArguments = JSON.stringify(supportProjectFuntionArgument);
    txReceipt.FunctionArgumentsHash = this.validationService.getMetadataDigest(supportProjectFuntionArgument);
    txReceipt.ChainType = this.network;
    txReceipt.ChainId = 123;
    txReceipt.QueueStatus = QueueStatus.Draft;
    txReceipt.TryCount = 0;
    txReceipt.Priority = 0;
    txReceipt.ResendCount = 0;
    await this.dbHelperService.saveTxReceipt(txReceipt);
    
    const supportProjectDB = new SupportProject();
    supportProjectDB.Amount = supportProjectDTO.amount;
    supportProjectDB.EOA = supportProjectDTO.eoa;
    supportProjectDB.Unit = supportProjectDTO.unit;
    supportProjectDB.Date = supportProjectDTO.date;
    supportProjectDB.Project = project;
    await this.dbHelperService.saveSupportProject(supportProjectDB);

    let response = new CommonParameter();
    response.uuid = txReceipt.UUId;
    response.functionName = txReceipt.FunctionName;

    return response;
  }


  public async getProjectById(dto: getProjectByIdRequest): Promise<any> {
    this.logger.log("getProjectById has been initiated.");
    const project = await this.dbHelperService.getProjectByWeb2ProjectId(dto.projectId);
    this.logger.log("Returning from getProjectById.");
    return project;
  }

  public async getAllProject(): Promise<any> {
    this.logger.log("getAllProject has been initiated.");
    const project = await this.dbHelperService.getAllProject();
    this.logger.log("Returning from getAllProject.");
    return project;
  }

  public async deleteProject(dto: DeleteProject): Promise<any> {
    this.logger.log("deleteProject has been initiated.");
    const response = await this.dbHelperService.deleteProject(dto);
    this.logger.log("Returning from deleteProject.");
    return response;
  }

  public async getProject(): Promise<any> {
    this.logger.log("getProject has been initiated.");
    const response = await this.dbHelperService.getProject();
    this.logger.log("Returning from getProject.");
    return response;
  }
}
