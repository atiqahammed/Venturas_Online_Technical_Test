import {
  Controller,
  Logger,
  Post,
  UseGuards,
  Body,
} from "@nestjs/common";
import { NFTService } from "./services/nft.service";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";
import { createNFTBatchRequest } from "./dto/nft.dto";
import { JwtAuthGuard } from "../../auth/tokenAuth/jwt-auth.guard";

@Controller("api/v1")
export class NftController {
  private readonly logger = new Logger(NftController.name);
  constructor(private service: NFTService) {}

  @Post("create-nft-batch")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to create NFT Batch",
    summary: "create-nft-batch",
  })
  public async createNFTBatch(
    @Body() body: createNFTBatchRequest
  ): Promise<any> {
    this.logger.log(`createNFTBatch has been initiated`);
    let response= await this.service.queueCreateNftBatch(body);
    this.logger.log(`returning from createNFTBatch`);
    return response;

  }

}
