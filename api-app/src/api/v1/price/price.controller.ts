import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { getCurrentBalanceRequest } from "./dto/price.dto";
import { PriceService } from "./services/price.service";
import { AuthService } from "../../auth/tokenAuth/auth.service";
import { JwtAuthGuard } from "../../auth/tokenAuth/jwt-auth.guard";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";

const balanceData = {
  "in-liquidity-pool": 20,
  unit: "matic",
  date: "12-12-2012",
};

@Controller("api/v1")
export class PriceController {
  private readonly logger = new Logger(PriceController.name);
  constructor(
    private serv: PriceService,
    private readonly authService: AuthService
  ) {}

  @Post("current-balance")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This api refers to GET current Balance",
    summary: "current-balance",
  })
  public async getCurrentBalance(
    @Body() body: getCurrentBalanceRequest
  ): Promise<any> {
    this.logger.log(`getCurrentBalance has been initiated`);
    // const response = await this.service.getCurrentBalance(body);

    this.logger.log(`returning from getCurrentBalance`);
    if (body.projectId == 2) {
      throw new NotFoundException("Invalid project Id");
    } else {
      return balanceData;
    }
  }
}
