import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "../../../../model/user.type.entity";
import { UserInfo } from "../../../../model/user.info.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
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
import { resolve } from "path/posix";

@Injectable()
export class UserTypeDBHelperService {
  private readonly logger = new Logger(UserTypeDBHelperService.name);
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepo: Repository<UserType>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepo: Repository<UserInfo>
  ) {}

  async getUserType(): Promise<UserTypeResponse[]> {
    this.logger.log(`getUserType has been initiated.`);
    let result;
    let response: UserTypeResponse[] = new Array();
    try {
      result = await this.userTypeRepo.find();
      response = result.map((item) => {
        return {
          name: item.Name,
          id: item.Id,
          createdDate: item.CreateDate.toString(),
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not get user type. Something went wrong."
      );
    }

    this.logger.log(`returning from getUserType.`);
    return response;
  }

  async saveUserType(data: SaveUserType): Promise<SaveUserType> {
    this.logger.log(`saveUserType has been initiated.`);
    let response = new UserTypeResponse();
    try {
      let newUserType = new UserType();
      newUserType.Name = data.name;
      let result = await this.userTypeRepo.save(newUserType);
      response.name = result.Name;
      response.id = result.Id;
      response.createdDate = result.CreateDate.toString();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not save user type. Something went wrong."
      );
    }

    this.logger.log(`returning from saveUserType.`);
    return response;
  }

  async getUserTypeById(id: number) {
    const userType = await this.userTypeRepo.findOne(id);
    if (!userType || !userType.Id) {
      throw new BadRequestException(`User Type not found with id: ${id}`);
    }
    return userType;
  }

  async deleteUserType(data: DeleteUserType): Promise<any> {
    this.logger.log(`deleteUserType has been initiated.`);

    const userType = await this.userTypeRepo.findOne(data.id);
    if (!userType || !userType.Name) {
      throw new BadRequestException(
        `User type not exists with id: ${data.id}.`
      );
    }
    try {
      await this.userTypeRepo.delete(data.id);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not delete user type. Something went wrong."
      );
    }

    this.logger.log(`returning from deleteUserType.`);
    return true;
  }

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

  async deleteUserInfo(data: DeleteUserInfo): Promise<any> {
    this.logger.log(`deleteUserInfo has been initiated.`);

    const userInfo = await this.userInfoRepo.findOne(data.id);
    if (!userInfo || !userInfo.Name) {
      throw new BadRequestException(
        `User not exists with id: ${data.id}.`
      );
    }
    try {
      await this.userInfoRepo.delete(data.id);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        "Could not delete user. Something went wrong."
      );
    }

    this.logger.log(`returning from deleteUserInfo.`);
    return true;
  }
}
