import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "../../../../model/user.type.entity";
import { UserInfo } from "../../../../model/user.info.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  SaveUserType,
  UserTypeResponse,
  DeleteUserType,
} from "../dto/user-type.dto";
import {
  SaveUserInfo,
  UserInfoResponse,
  DeleteUserInfo,
  LoginDTO,
} from "../dto/user-info.dto";
import { InviteUserDTO } from "../dto/invite-user.dto";
import { Invitation } from "../../../../model/invittion.entity";

@Injectable()
export class UserTypeDBHelperService {
  private readonly logger = new Logger(UserTypeDBHelperService.name);
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepo: Repository<UserInfo>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>
  ) {}

  async getUserInfoById(data: DeleteUserInfo): Promise<UserInfoResponse> {
    this.logger.log(`getUserInfoById has been initiated.`);
    let result = await this.userInfoRepo.findOne(data.id);

    if(!result) {
      throw new BadRequestException(
        `User not exists with id: ${data.id}.`
      );
    }

    let response: UserInfoResponse = new UserInfoResponse();
    try {
      
      response.id = result.Id;
      response.name = result.Name;
      // response.EOA = result.EOA;
      response.email = result.Email;
      response.createdDate = result.CreateDate.toString();

    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not get user info. Something went wrong."
      );
    }

    this.logger.log(`returning from getUserInfoById.`);
    return response;
  }

  async getUserInfo(): Promise<UserInfoResponse[]> {
    this.logger.log(`getUserInfo has been initiated.`);
    let result;
    let response: UserInfoResponse[] = new Array();
    try {
      result = await this.userInfoRepo.find();
      response = result.map((item) => {
        return {
          name: item.Name,
          email: item.Email,
          id: item.Id,
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not get user info. Something went wrong."
      );
    }

    this.logger.log(`returning from getUserInfo.`);
    return response;
  }

  async loginInUser(data: LoginDTO): Promise<UserInfoResponse> {
    this.logger.log(`loginInUser has been initiated.`);

    const userWithEmail = await this.userInfoRepo.findOne({
      where: {
        Email: data.email,
      },
    });

    if (!userWithEmail || !userWithEmail.Email) {
      throw new BadRequestException(`Invalid user credential.`);
    }

    const passwordCheck = await bcrypt.compare(
      data.password,
      userWithEmail.Password
    );
    if(!passwordCheck) {
      throw new BadRequestException(`Invalid user credential.`);
    }

    let response = new UserInfoResponse();
    response.name = userWithEmail.Name;
    response.email = userWithEmail.Email;
    response.id = userWithEmail.Id;
    // response.EOA = userWithEmail.EOA;
    response.createdDate = userWithEmail.CreateDate.toString();

    return response;
  }

  async saveUserInfo(data: SaveUserInfo): Promise<UserInfoResponse> {
    this.logger.log(`saveUserInfo has been initiated.`);

    const userWithEmail = await this.userInfoRepo.findOne({
      where: {
        Email: data.email,
      },
    });

    if (userWithEmail) {
      throw new BadRequestException(
        `This email '${data.email}' has already been used.`
      );
    }

    const userWithEoa = await this.userInfoRepo.findOne({
      where: {
        EOA: data.EOA,
      },
    });

    if (userWithEoa) {
      throw new BadRequestException(
        `This EOA '${data.EOA}' has already been used.`
      );
    }

    let response = new UserInfoResponse();
    const saltRounds = (Math.floor(Math.random() * data.password.length) + 1000) % 1000;

    try {
      let newUserInfo = new UserInfo();
      newUserInfo.Name = data.name;
      newUserInfo.Email = data.email;
      // newUserInfo.EOA = data.EOA;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);
      newUserInfo.Password = passwordHash;
      let result = await this.userInfoRepo.save(newUserInfo);
      response.name = result.Name;
      response.email = result.Email;
      response.id = result.Id;
      // response.EOA = result.EOA;
      response.createdDate = result.CreateDate.toString();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not save user. Something went wrong."
      );
    }

    this.logger.log(`returning from saveUserInfo.`);
    return response;
  }

  async inviteUser(userInfo: InviteUserDTO): Promise<any> {
    this.logger.log(`inviteUser has been initiated.`);

    const existingUsers = await this.invitationRepo.find({
      where: {
        Email: userInfo.email,
        Status: 'completed'
      }
    });

    if(existingUsers && existingUsers.length > 0) {
      return {
        isSuccess: false,
        message: `User already exists with email: ${userInfo.email}`
      }
    }

    let inviation = new Invitation();
    inviation.Email = userInfo.email;
    inviation.CompanyId = userInfo.companyId;
    inviation.UserType = userInfo.userType;
    inviation.InvitedBy = userInfo.invitedBy;
    inviation.Status = 'pending';
    inviation.UUID = uuidv4();


    const saltRounds = (Math.floor(Math.random() * 13) + 1000) % 1000;
    let password = uuidv4();
    const passwordHash = await bcrypt.hash(password, saltRounds);
    inviation.TemporaryPassword = passwordHash;

    const user = await this.invitationRepo.save(inviation);

    this.logger.log(`returning from inviteUser.`);
    return {
      isSuccess: true,
      email: userInfo.email,
      uuid: user.UUID,
      password: password
    }
  }
}
