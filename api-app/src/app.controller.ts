import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiExcludeEndpoint()
  @Post('web3callback')
  web3callback(@Body() _obj: any) {
    console.log('--------------------');
    console.log(`web3callback`);
    console.log(_obj);
    console.log('--------------------');
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }

  @ApiExcludeEndpoint()
  @Post('CreateNFTBatchCallback')
  CreateNFTBatchCallback(@Body() _obj: any) {
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }

  @ApiExcludeEndpoint()
  @Post('VoteCallback')
  VoteCallback(@Body() _obj: any) {
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }

  @ApiExcludeEndpoint()
  @Post('ProposalCallback')
  ProposalCallback(@Body() _obj: any) {
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }

  @ApiExcludeEndpoint()
  @Post('AllocationBreakdownCallback')
  AllocationBreakdownCallback(@Body() _obj: any) {
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }

  @ApiExcludeEndpoint()
  @Post('TokenAllocationCallback')
  TokenAllocationCallback(@Body() _obj: any) {
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }

  @ApiExcludeEndpoint()
  @Post('CreateProjectCallback')
  CreateProjectCallback(@Body() _obj: any) {
    return {
      'resp': 'Success',
      'statusCode': '200',
      'statusMessage': 'Updates Complete'
    };
  }
}
