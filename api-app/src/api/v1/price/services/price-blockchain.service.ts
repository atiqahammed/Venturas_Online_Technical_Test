import { Injectable, Logger } from '@nestjs/common';
import { getWallet } from '../../../../common/ethers/wallet';
import { getPricingInstance } from '../../../../common/ethers/contract';
import { getDeployedPath } from '../../../../common/ethers/file';
import * as fs from 'fs';
const network = process.env.NETWORK || 'ganache'
const branch = process.env.BRANCH || 'develop'

@Injectable()
export class PriceBlockChainService {
    private readonly logger = new Logger(PriceBlockChainService.name);

    public async getPrice(): Promise<any> {

        this.logger.log(`getPrice method initiated.`);
        this.logger.log(['network, branch', network, branch]);
        const jsonPath = getDeployedPath(network, branch);
        let content = JSON.parse(fs.readFileSync(jsonPath).toString());

        const adminWallet = getWallet()
        const pricing = getPricingInstance(content.ContractAddress, adminWallet);
        let currentPrice = await pricing.getPricing();
        this.logger.log("currentPrice : ", currentPrice.toString());

        this.logger.log(`returning from getPrice method`);

        return Number(currentPrice);
    }

    public async setPrice(newPrice: number): Promise<any> {

        const jsonPath = getDeployedPath(network, branch);
        let content = JSON.parse(fs.readFileSync(jsonPath).toString());

        const adminWallet = getWallet();
        const pricing = getPricingInstance(content.ContractAddress, adminWallet);

        const txReceipt  = await pricing.setPricing(newPrice);
        const txReceiptResponse = {
            ...txReceipt,
            gasPrice: Number(txReceipt.gasPrice),
            gasLimit: Number(txReceipt.gasLimit),
            value: Number(txReceipt.value)
        }
        this.logger.log(txReceiptResponse);
        this.logger.log("New Price is set");  
        return txReceiptResponse;
    }
}