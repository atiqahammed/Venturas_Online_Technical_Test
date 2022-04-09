import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceBlockChainService } from './price-blockchain.service';
import { Project } from '../../../../model/project.entity';
import { PriceDBHelperService } from './db-helper.service';
import { TxStatus } from '../../../../common/enums/tx-status.enum';
import { Price } from '../dto/price.dto';
import { FunctionNames } from '../../../../common/enums/function-names.enum';
import { v4 as uuidv4 } from 'uuid';
import QueueStatus from '../../../../common/enums/queue-status.enum';
import { ethers } from 'ethers';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    private bockchainService: PriceBlockChainService,
    private dbHelperService: PriceDBHelperService
  ) { }

  public async getPrice(): Promise<any> {
    this.logger.log(`getPrice method initiated.`);
    //const price = await this.bockchainService.getPrice();
    const price= 2.30332211;
    this.logger.log(`returning from getPrice method.`);
    return price;
  }

  public async setPrice(dto: Price): Promise<any> {
    this.logger.log('ptice service');


    let project = await this.projectRepo.findOne(dto.pojectId);
    if(!project) {
      throw new BadRequestException('Project not found');
    }
    

 /*
    this.logger.log(`project ${project}`)

    const txReceipt = await this.bockchainService.setPrice(dto.tokenPrice);

    if(txReceipt.hash != null){


      const messageBytes = ethers.utils.toUtf8Bytes(JSON.stringify(dto));
      const hash = ethers.utils.sha256(messageBytes);

      const transactionReceiptData = {
        functionArguments: JSON.stringify(dto),
        uuid: uuidv4(),
        project: project,
        queueStatus: QueueStatus.Complete,
        trxResponse: JSON.stringify(txReceipt),
        functionName: FunctionNames.SetPrice,
        functionArgumentsHash: hash,
        createdBy: project.Id,
        lastChangedBy: project.Id
      }

      this.logger.log(`Saving Transaction Receipt`);
      this.logger.log(transactionReceiptData);
  
      let transactionReceipt = await this.dbHelperService.createTransactionReceipt(transactionReceiptData);

      const transactionReceiptStatusData = {
        txHash: txReceipt.hash,
        miningStatus: TxStatus.Mined,
        transactionReceipt: transactionReceipt['Id'],
        queueStatus: QueueStatus.Complete,
        txFee: txReceipt.gasPrice * txReceipt.gasLimit,
        forwarderNonce: txReceipt.nonce,
        gasPriceLevel: txReceipt.gasLimit,
        gasPriceGwei: txReceipt.gasPrice,
        createdBy: project.Id,
        lastChangedBy: project.Id
      }

      this.logger.log(`Saving transactionReceiptStatusData`);
      this.logger.log(transactionReceiptStatusData);
  
      await this.dbHelperService.createTransactionReceiptStatus(transactionReceiptStatusData);
    }
*/
    
const txReceipt="56ad65s6d56s5d65s6d5s65d6s5d6+55354354#%"
return {isSuccess: true,txReceipt:txReceipt};
  }
}