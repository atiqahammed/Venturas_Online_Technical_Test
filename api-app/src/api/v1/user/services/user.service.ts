import { Injectable, Logger } from "@nestjs/common";
import { LoginDTO, SaveUserInfo } from "../dto/user-info.dto";
import {
  SaveUserType,
  UserTypeResponse,
  DeleteUserType,
} from "../dto/user-type.dto";
import { UserTypeDBHelperService } from "./db-helper.service";
import * as uuid from 'uuid';
import { CacheManagerService } from '../../../../common/cache/cache.service';








@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly timeoutNum: number;

  constructor(
    private dbHelperService: UserTypeDBHelperService, 
    private readonly cacheManagerService: CacheManagerService
  ) {
    this.timeoutNum = Number(process.env.SESSION_TIMEOUT) || 3600;
  }

  public async saveUserType(dto: SaveUserType): Promise<any> {
    this.logger.log("SaveUserType has been initiated.");
    const response = await this.dbHelperService.saveUserType(dto);
    this.logger.log("Returning from SaveUserType.");
    return response;
  }

  public async getUserType(): Promise<any> {
    this.logger.log("getUserType has been initiated.");
    const response = await this.dbHelperService.getUserType();
    this.logger.log("Returning from getUserType.");
    return response;
  }

  public async deleteUserType(dto: DeleteUserType): Promise<any> {
    this.logger.log("deleteUserType has been initiated.");
    const response = await this.dbHelperService.deleteUserType(dto);
    this.logger.log("Returning from deleteUserType.");
    return response;
  }

  public async saveUserInfo(dto: SaveUserInfo): Promise<any> {
    this.logger.log("SaveUserType has been initiated.");
    const response = await this.dbHelperService.saveUserInfo(dto);
    let apiKey = uuid.v1();
    await this.cacheManagerService.addToCache(dto.email, apiKey, this.timeoutNum);
    response['apiKey'] = apiKey;
    this.logger.log("Returning from SaveUserType.");
    return response;
  }


  public async loginUser(dto: LoginDTO): Promise<any> {
    this.logger.log("loginUser has been initiated.");
    const response = await this.dbHelperService.loginInUser(dto);
    let apiKey = uuid.v1();
    await this.cacheManagerService.addToCache(dto.email, apiKey, this.timeoutNum);
    response['apiKey'] = apiKey;
    this.logger.log("loginUser from SaveUserType.");
    return response;
  }

  public async getUserTypeById(dto: DeleteUserType): Promise<any> {
    this.logger.log('getUserTypeById has been initiated.');
    const userType = await this.dbHelperService.getUserTypeById(dto.id);
    let response = new UserTypeResponse();
    response.name = userType.Name;
    response.id = userType.Id;
    response.createdDate = userType.CreateDate.toString();
    this.logger.log('Returning from getUserTypeById.');
    return response;
  }

  public async getUserInfo(): Promise<any> {
    this.logger.log("getUserInfo has been initiated.");
    const response = await this.dbHelperService.getUserInfo();
    this.logger.log("Returning from getUserInfo.");
    return response;
  }

  public async getUserInfoById(dto: DeleteUserType): Promise<any> {
    this.logger.log("getUserInfoById has been initiated.");
    const response = await this.dbHelperService.getUserInfoById(dto);
    this.logger.log("Returning from getUserInfoById.");
    return response;
  }

  public async deleteUserInfo(dto: DeleteUserType): Promise<any> {
    this.logger.log("deleteUserInfo has been initiated.");
    const response = await this.dbHelperService.deleteUserInfo(dto);
    this.logger.log("Returning from deleteUserInfo.");
    return response;
  }
}
