import { Injectable, Logger } from "@nestjs/common";
import { LoginDTO, SaveUserInfo } from "../dto/user-info.dto";
import {
  SaveUserType,
  UserTypeResponse,
  DeleteUserType,
} from "../dto/user-type.dto";
import { UserTypeDBHelperService } from "./db-helper.service";
import * as uuid from "uuid";
import { CacheManagerService } from "../../../../common/cache/cache.service";
import { InviteUserDTO } from "../dto/invite-user.dto";
import { CourierClient } from "@trycourier/courier";

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

  public async saveUserInfo(dto: SaveUserInfo): Promise<any> {
    this.logger.log("SaveUserType has been initiated.");
    const response = await this.dbHelperService.saveUserInfo(dto);
    let apiKey = uuid.v1();
    await this.cacheManagerService.addToCache(
      dto.email,
      apiKey,
      this.timeoutNum
    );
    response["apiKey"] = apiKey;
    this.logger.log("Returning from SaveUserType.");
    return response;
  }

  public async loginUser(dto: LoginDTO): Promise<any> {
    this.logger.log("loginUser has been initiated.");
    const response = await this.dbHelperService.loginInUser(dto);
    let apiKey = uuid.v1();
    await this.cacheManagerService.addToCache(
      dto.email,
      apiKey,
      this.timeoutNum
    );
    response["apiKey"] = apiKey;
    this.logger.log("loginUser from SaveUserType.");
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

  public async inviteUser(userInfo: InviteUserDTO) {
    this.logger.log("inviteUser has been initiated.");

    const response = await this.dbHelperService.inviteUser(userInfo);
    if (response.isSuccess) {
      const courier = CourierClient({
        authorizationToken: "pk_prod_S754PKGGSX47MQNW675SFBS56EDH",
      });

      const { requestId } = await courier.send({
        message: {
          content: {
            title: "Welcome to Employee Registration",
            body: "Please complete registration {{info}}",
          },
          data: {
            info: `here ${process.env.WEB_REGISTRATION_COMPLETE_URL}?token=${response.uuid}. Temporary Password: ${response.password}`,
          },
          to: {
            email: response.email,
          },
        },
      });
    }
    this.logger.log("inviteUser from deleteUserInfo.");
    return {isSuccess: response.isSuccess};
  }
}
