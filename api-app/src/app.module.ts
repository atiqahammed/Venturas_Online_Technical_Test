import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceModule } from './api/v1/price/price.module';
import { ProjectModule } from './api/v1/project/project.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UserModule } from './api/v1/user/user.module';
import { ProposalModule } from './api/v1/proposal/proposal.module';
import { NftModule } from './api/v1/nft/nft.module';
import { GraphWatcherModule } from './modules/graph-watcher/graph-watcher.module';
import { GraphWatcherService } from './modules/graph-watcher/services/graph-watcher.service';
import { TransactionProcessorModule } from './modules/transaction-processor/transaction-processor.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.forRoot(),
    PriceModule,
    ProjectModule,
    UserModule,
    ProposalModule,
    NftModule,
    GraphWatcherModule,
    TransactionProcessorModule
  ],
  controllers: [AppController],
  providers: [AppService,]
})
export class AppModule {}
