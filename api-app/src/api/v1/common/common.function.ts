import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "../../../model/project.entity";
import { UserInfo } from "../../../model/user.info.entity";
import { UserType } from "../../../model/user.type.entity";

@Injectable()
export class commonDBHelper {
  private readonly logger = new Logger(commonDBHelper.name);
  constructor(
    // @InjectRepository(PaymentHistory)
    // private readonly paymentHistoryRepo: Repository<PaymentHistory>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepo: Repository<UserInfo>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    // @InjectRepository(Transfer)
    // private readonly transferepo: Repository<Transfer>,
    @InjectRepository(UserType)
    private readonly userTypeRepo: Repository<UserType>,
    // @InjectRepository(RoyaltyRatio)
    // private readonly royaltyRatioRepo: Repository<RoyaltyRatio>,
    // @InjectRepository(Phase)
    // private readonly phaseRepo: Repository<Phase>
  ) {}

  async getUserInfoById(id: number) {
    const userInfo = await this.userInfoRepo.findOne({
      where: {
        Id: id,
      },
    });

    if (!userInfo || !userInfo.Id) {
      throw new BadRequestException(`userInfo not found with id: ${id}`);
    }
    return userInfo;
  }

  async getUserTypeById(id: number) {
    const userType = await this.userTypeRepo.findOne(id);
    if(!userType || !userType.Id) {
      throw new BadRequestException(`user Type not found with id: ${id}`);
    }
    return userType;
  }

  async getProjectById(id: number) {
    const project = await this.projectRepo.findOne({
      where: {
        Id: id,
      },
    });

    if (!project || !project.Id) {
      throw new BadRequestException(`Project not found with id: ${id}`);
    }
    return project;
  }
  
  // async getTransferById(id: number) {
  //   const transfer = await this.transferepo.findOne({
  //     where: {
  //       Id: id,
  //     },
  //   });

  //   if (!transfer || !transfer.Id) {
  //     throw new BadRequestException(`transfer not found with id: ${id}`);
  //   }
  //   return transfer;
  // }
  // async getPhaseById(id: number) {
  //   const phase = await this.phaseRepo.findOne({
  //     where: {
  //       Id: id,
  //     },
  //   });

  //   if (!phase || !phase.Id) {
  //     throw new BadRequestException(`Phase not found with id: ${id}`);
  //   }
  //   return phase;
  // }
  

  // async getRoyaltyRatioById(id: number) {
  //   const royalty_ratio = await this.royaltyRatioRepo.findOne({
  //     where: {
  //       Id: id,
  //     },
  //   });

  //   if (!royalty_ratio || !royalty_ratio.Id) {
  //     throw new BadRequestException(`Royalty Ratio not found with id: ${id}`);
  //   }
  //   return royalty_ratio;
  // }

}