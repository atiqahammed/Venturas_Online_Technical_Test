/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CallbackService } from '../../../common/callback.module';
import { FunctionNames } from '../../../common/enums/function-names.enum';
const crypto = require("crypto");
import { v4 as uuidv4 } from 'uuid';
import { GraphWatcherDBHelperService } from './db-helper.service';
import {NFTBatchFunctionArgumentDTO } from '../../../api/v1/nft/dto/nft.dto';
import { ProposalFunctionArgumentDTO, VoteFunctionArgumentDTO } from '../../../api/v1/proposal/dto/proposal.dto';
import { AllocationBreakdownFunctionArgumentDTO, CreateProjectRequestDTO, ProjectFunctionArgumentDTO, TokenAllocationDTO, TokenAllocationFunactionArgumentDTO,SupportProjectFunctionArgumentDTO } from '../../../api/v1/project/dto/project.dto';
import { ProjectDBHelperService } from '../../../api/v1/project/services/db-helper.service';
import { ProposalDBHelperService } from '../../../api/v1/proposal/services/db-helper.service';
import { TokenDistribution } from '../../../model/token.distribution.entity';
import { TokenDistributionType } from '../../../model/token.distribution.type.entity';
import { TxStatus } from '../../../common/enums/tx-status.enum';
import { CallbackRequest } from '../../../model/callback.request.entity';
import { Project } from '../../../model/project.entity';
import e from 'express';

@Injectable()
export class GraphWatcherService {
  private readonly log = new Logger(GraphWatcherService.name);
  private readonly _callbackService: CallbackService;

  private lastProcessedAt: Date;
  constructor(
    callbackService: CallbackService,
    private readonly dbHelperService: GraphWatcherDBHelperService,
    private readonly projectDbHelperService: ProjectDBHelperService,
    private readonly proposalDbHelperService: ProposalDBHelperService
  ) {
    this._callbackService = callbackService;
    this.lastProcessedAt = null;
  }

  public async saveMockProject(uuid: string, projectId: number, project: Project): Promise<any> {
    this.log.log("saveMockProject has been initiated.");
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const projectItem = { uuid: uuid, projectId: projectId }
    const mockCallbackFunctionName = FunctionNames.CreateProject;

    
    const fundPayload = {
      projectId: projectItem.projectId,
      functionName: mockCallbackFunctionName,
      status: "success",
      messages: ['Fund Transfer Complete'],
      data: {
        step: 1,
        uuid: projectItem.uuid,
      },
    };

    const ownerTransferDone = {
      projectId: projectItem.projectId,
      functionName: mockCallbackFunctionName,
      status: "success",
      messages: ['Owner Transfer Complete'],
      data: {
        step: 2,
        uuid: projectItem.uuid,
      },
    };

    const deployment1Done = {
      projectId: projectItem.projectId,
      functionName: mockCallbackFunctionName,
      status: "success",
      messages: ['Smart Contract 1 Deployment Complete'],
      data: {
        step: 3,
        uuid: projectItem.uuid,
      },
    };

    const deployment2Done = {
      projectId: projectItem.projectId,
      functionName: mockCallbackFunctionName,
      status: "success",
      messages: ['Smart Contract 2 Deployment Complete'],
      data: {
        step: 4,
        uuid: projectItem.uuid,
      },
    };

    let callbackPayload = {
      projectId: projectItem.projectId,
      functionName: FunctionNames.CreateProject,
      status: "success",
      messages: ['Success'],
      data: {
        step: 5,
        transactionStatus: TxStatus.Mined,
        transactionHash: `0x${crypto.randomBytes(30).toString("hex")}`,
        uuid: projectItem.uuid,
      },
    };

    let callbackUrl = "web3callback";

    try {
      if (callbackUrl !== "") {
        this.log.log(`Sending call back to: ${callbackUrl}`);
        await delay(5000);
        await this.sendGraphwatcherCallback(fundPayload, project);
        await delay(2000);
        await this.sendGraphwatcherCallback(ownerTransferDone, project);
        await delay(2000);
        await this.sendGraphwatcherCallback(deployment1Done, project);
        await delay(2000);
        await this.sendGraphwatcherCallback(deployment2Done, project);
        await delay(2000);
        await this.sendGraphwatcherCallback(callbackPayload, project);
      }
    } catch (error) {
      this.log.error(error);
    }

    this.log.log("saveMockProject from saveProject.");
    return true;
  }

  private async updateAllocationBreakDownInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }

    const functionArgument: AllocationBreakdownFunctionArgumentDTO = JSON.parse(functionArgsStr);

    const projectId = functionArgument.functionArgument.projectId;
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(projectId);
    const distributionTypes = project['TokenDistributionType'];

    for(let i = 0; i < functionArgument.functionArgument.distribution.length; i++) {
      let distributionItem = functionArgument.functionArgument.distribution[i];
      let distributionType = distributionTypes.find(item => item.Name == distributionItem.name);
      let existingItem = distributionType.TokenDistribution.find(item => item.EOA == distributionItem.eoa);
      if(existingItem) {
        existingItem.Percent = distributionItem.percent;
        await this.projectDbHelperService.saveTokenDistribution(existingItem);
      } else {
        let newDistribution = new TokenDistribution();
        newDistribution.EOA = distributionItem.eoa;
        newDistribution.Percent = distributionItem.percent;
        newDistribution.TokenDistributionType = distributionType;
        newDistribution.Project = project;
        newDistribution.CalculatedBy = distributionType.CalculatedBy;
        await this.projectDbHelperService.saveTokenDistribution(newDistribution);
      }
    }

    // const governance = functionArgument.functionArgument.distribution[1];
    // if(governance && governance.length > 0) {
    //   const distributionType = distributionTypes.find(item => item.Name == 'governance');
    //   for(let i = 0; i < governance.length; i++) {
    //     const newtItem = governance[i];
    //     let existingItem = distributionType.TokenDistribution.find(item => item.EOA == newtItem.eoa);
    //     if(existingItem) {
    //      
    //     } else {
    //       let newDistribution = new TokenDistribution();
    //       newDistribution.EOA = newtItem.eoa;
    //       newDistribution.Percent = newtItem.percent;
    //       newDistribution.TokenDistributionType = distributionType;
    //       newDistribution.Project = project;
    //       newDistribution.CalculatedBy = distributionType.CalculatedBy;
    //       await this.projectDbHelperService.saveTokenDistribution(newDistribution);
    //     }
    //   }
    // }

    // const fundraising = functionArgument.functionArgument.distribution.fundraising;
    // if(fundraising && fundraising.length > 0) {
    //   const distributionType = distributionTypes.find(item => item.Name == 'fundraising');
    //   for(let i = 0; i < fundraising.length; i++) {
    //     const newtItem = fundraising[i];
    //     let existingItem = distributionType.TokenDistribution.find(item => item.EOA == newtItem.eoa);
    //     if(existingItem) {
    //       existingItem.Percent = newtItem.percent;
    //       await this.projectDbHelperService.saveTokenDistribution(existingItem);
    //     } else {
    //       let newDistribution = new TokenDistribution();
    //       newDistribution.EOA = newtItem.eoa;
    //       newDistribution.Percent = newtItem.percent;
    //       newDistribution.TokenDistributionType = distributionType;
    //       newDistribution.Project = project;
    //       newDistribution.CalculatedBy = distributionType.CalculatedBy;
    //       await this.projectDbHelperService.saveTokenDistribution(newDistribution);
    //     }
    //   }
    // }

    // const utility = functionArgument.functionArgument.distribution.utility;
    // if(utility && utility.length > 0) {
    //   const distributionType = distributionTypes.find(item => item.Name == 'utility');
    //   for(let i = 0; i < utility.length; i++) {
    //     const newtItem = utility[i];
    //     let existingItem = distributionType.TokenDistribution.find(item => item.EOA == newtItem.eoa);
    //     if(existingItem) {
    //       existingItem.Percent = newtItem.percent;
    //       await this.projectDbHelperService.saveTokenDistribution(existingItem);
    //     } else {
    //       let newDistribution = new TokenDistribution();
    //       newDistribution.EOA = newtItem.eoa;
    //       newDistribution.Percent = newtItem.percent;
    //       newDistribution.TokenDistributionType = distributionType;
    //       newDistribution.Project = project;
    //       newDistribution.CalculatedBy = distributionType.CalculatedBy;
    //       await this.projectDbHelperService.saveTokenDistribution(newDistribution);
    //     }
    //   }
    // }


    await this.dbHelperService.updateTransactionStatus(transaction.Id);

    let callbackPayload = {
      projectId: project.Web2ProjectId,
      functionName: FunctionNames.AllocationBreakdown,
      status: 'success',
      messages: [],
      data: {
        transactionStatus: transaction['TxHash'],
        transactionHash: `0x${crypto.randomBytes(36).toString('hex')}`,
        uuid: TransactionReceipt['UUId']
      }
    };

    await this.sendGraphwatcherCallback(callbackPayload, project);
  }


  private async sendGraphwatcherCallback(callbackPayload: any, project: Project) {
    const callbackUrl = 'web3callback';
    const callbackInfo = new CallbackRequest();

    callbackInfo.Body = JSON.stringify(callbackPayload);
    callbackInfo.Project = project;
    callbackInfo.UUId = callbackPayload.data.uuid ? callbackPayload.data.uuid : '';
    callbackInfo.Status = 'SUCCESS';
    callbackInfo.URL = `${process.env.TRANSACTION_CALLBACK_URL}/${callbackUrl}`;
    callbackInfo.CallbackName = callbackPayload.functionName;
    callbackInfo.Version = '1.0.0';
    callbackInfo.Response = '';

    try {
      this.log.log(`Sending call back to: ${callbackUrl}`);
      const callbackAPIResponse = await this._callbackService
        .callback(callbackPayload, callbackUrl, false)
        .catch((err) => {
          this.log.error(`${err.message}\nStack: ${err.stack}`);
        });
      
      if(callbackAPIResponse) {
        callbackInfo.Status = callbackAPIResponse.isError ? 'ERROR' :'SUCCESS';
        callbackInfo.Response = callbackAPIResponse.response;
      } else {
        callbackInfo.Status = 'ERROR';
      }
      
      await this.dbHelperService.saveCallbackRequest(callbackInfo);
    } catch(error) {
      this.log.error(error);
    }
  }


  private async updateTokenAllocationInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }

    const functionArgument: TokenAllocationFunactionArgumentDTO = JSON.parse(functionArgsStr);
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(functionArgument.functionArgument.projectId);


    for(let i = 0; i < functionArgument.functionArgument.tokenTypes.length; i++) {
      let tokenType = functionArgument.functionArgument.tokenTypes[i];
      let savedTokenType = project.TokenDistributionType.find(item => item.Name == tokenType.name);
      if(savedTokenType) {
        savedTokenType.Allocation = tokenType.allocation;
        savedTokenType.CalculatedBy = functionArgument.functionArgument.calculateby;
        await this.projectDbHelperService.saveTokenDistributionType(savedTokenType);
      } else {
        let newDistribution = new TokenDistributionType();
        newDistribution.Name = tokenType.name;
        newDistribution.Allocation = tokenType.allocation;
        newDistribution.Type = tokenType.type;
        newDistribution.FundStartDate = tokenType.fundStartDate;
        newDistribution.FundEndDate = tokenType.fundEndDate;
        newDistribution.FundTargetAmount = tokenType.fundTargetAmount;
        newDistribution.FundMinimumAmount = tokenType.fundMinimumAmount;
        newDistribution.FundUnit = tokenType.fundUnit;
        newDistribution.FundTokenPrice = tokenType.fundTokenPrice;

        newDistribution.CalculatedBy = functionArgument.functionArgument.calculateby;
        newDistribution.Project = project;
        await this.projectDbHelperService.saveTokenDistributionType(newDistribution);
      }
    }
    await this.dbHelperService.updateTransactionStatus(transaction.Id);

    let callbackPayload = {
      projectId: project.Web2ProjectId,
      functionName: FunctionNames.TokenAllocation,
      status: 'success',
      messages: [],
      data: {
        transactionStatus: transaction['TxHash'],
        transactionHash: `0x${crypto.randomBytes(36).toString('hex')}`,
        uuid: TransactionReceipt['UUId']
      }
    };

    await this.sendGraphwatcherCallback(callbackPayload, project);
  }


  private async updateVoteInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }

    const functionArgument: VoteFunctionArgumentDTO = JSON.parse(functionArgsStr);
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(functionArgument.functionArgument.projectId);
    
    await this.dbHelperService.updateTransactionStatus(transaction.Id);

    let callbackPayload = {
      projectId: project.Web2ProjectId,
      functionName: FunctionNames.Vote,
      status: 'success',
      messages: [],
      data: {
        transactionStatus: transaction['TxHash'],
        transactionHash: `0x${crypto.randomBytes(36).toString('hex')}`,
        uuid: TransactionReceipt['UUId']
      }
    };

    await this.sendGraphwatcherCallback(callbackPayload, project);
  }


  private async updateSupportProjectInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }

    const functionArgument: SupportProjectFunctionArgumentDTO = JSON.parse(functionArgsStr);
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(functionArgument.functionArgument.projectId);
    
    await this.dbHelperService.updateTransactionStatus(transaction.Id);

    let callbackPayload = {
      projectId: project.Web2ProjectId,
      functionName: FunctionNames.SupportProject,
      status: 'success',
      messages: [],
      data: {
        transactionStatus: transaction['TxHash'],
        transactionHash: `0x${crypto.randomBytes(36).toString('hex')}`,
        uuid: TransactionReceipt['UUId']
      }
    };
    await this.sendGraphwatcherCallback(callbackPayload, project);
  }

  private async updateProposalInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }

    const functionArgument: ProposalFunctionArgumentDTO = JSON.parse(functionArgsStr);

    const projectId = functionArgument.functionArgument.projectId;
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(projectId);

    await this.dbHelperService.updateTransactionStatus(transaction.Id);

    let callbackPayload = {
      projectId: project.Web2ProjectId,
      functionName: FunctionNames.Proposal,
      status: 'success',
      messages: [],
      data: {
        transactionStatus: TxStatus.Mined,
        transactionHash: transaction['TxHash'],
        uuid: TransactionReceipt['UUId']
      }
    };

    await this.sendGraphwatcherCallback(callbackPayload, project);
  }
  private async updateProjectInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }

    const functionArgument: ProjectFunctionArgumentDTO = JSON.parse(functionArgsStr);
    let project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(functionArgument.functionArgument.projectId);
    project.deploymentStep = 5;
    await this.projectDbHelperService.saveProject(project);
    await this.dbHelperService.updateTransactionStatus(transaction.Id);
    this.saveMockProject(TransactionReceipt['UUId'], project.Web2ProjectId, project);
  }
  private async updateNftBatchInformation(transaction: any) {
    const TransactionReceipt = transaction['TransactionReceipt'];
    const functionArgsStr = TransactionReceipt['FunctionArguments'];
    if(!functionArgsStr) {
      return;
    }
    const functionArgument: NFTBatchFunctionArgumentDTO = JSON.parse(functionArgsStr);

    console.log(functionArgument)
    const projectId = functionArgument.functionArgument.projectId;
    const project = await this.projectDbHelperService.getProjectDetailsByWeb2ProjectId(projectId);

    const distributionTypes = project['TokenDistributionType'];


    await this.dbHelperService.updateTransactionStatus(transaction.Id);

    let callbackPayload = {
      projectId: project.Web2ProjectId,
      functionName: FunctionNames.CreateNftBatch,
      status: 'success',
      messages: [],
      data: {
        transactionStatus: transaction['TxHash'],
        transactionHash: `0x${crypto.randomBytes(36).toString('hex')}`,
        uuid: TransactionReceipt['UUId']
      }
    };

    await this.sendGraphwatcherCallback(callbackPayload, project);
  }

  private async updateTransactionInformation(transaction: any) {

    const TransactionReceipt = transaction['TransactionReceipt'];
    if(!TransactionReceipt) {
      return;
    }

    const functionName = TransactionReceipt['FunctionName'];

    switch(functionName) {
      case FunctionNames.CreateNftBatch:
        await this.updateNftBatchInformation(transaction);
        break;
      case FunctionNames.Vote:
        await this.updateVoteInformation(transaction);
        break; 
      case FunctionNames.Proposal:
        await this.updateProposalInformation(transaction);
        break;
      case FunctionNames.AllocationBreakdown:
        await this.updateAllocationBreakDownInformation(transaction);
        break;
      case FunctionNames.TokenAllocation:
        await this.updateTokenAllocationInformation(transaction);
        break;
      case FunctionNames.CreateProject:
        await this.updateProjectInformation(transaction);
        break;  
        case FunctionNames.SupportProject:
          await this.updateSupportProjectInformation(transaction);
          break;  
    }
  }


  @Cron(CronExpression.EVERY_30_SECONDS)
  private async checkGraphWatcher(): Promise<void> {

    this.log.log(`Checking GraphWatcher at ${new Date()}`);
    const pendingTransactions = await this.dbHelperService.getPendingTxReceiptStatus();
    this.log.log(`Found ${pendingTransactions.length} pending transactions.`);

    for(let i = 0; i < pendingTransactions.length; i++) {
      const transaction = pendingTransactions[i];
      await this.updateTransactionInformation(transaction);
    }
  }

  async start(): Promise<void> {
    this.log.log('fast run');
  }
}

