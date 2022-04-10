import { Injectable, Logger } from "@nestjs/common";
import { LoginDTO } from "../dto/user-info.dto";
import { UserTypeDBHelperService } from "./db-helper.service";
import * as uuid from "uuid";
import { CacheManagerService } from "../../../../common/cache/cache.service";
import { InviteUserDTO, UserRegistrationDTO } from "../dto/invite-user.dto";
import { CourierClient } from "@trycourier/courier";
import { getCompanyListDTO, SaveCompanyDTO } from "../dto/user-type.dto";

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

  public async saveCompany(data: SaveCompanyDTO): Promise<any> {
    this.logger.log("saveCompany has been initiated.");
    const response = await this.dbHelperService.saveCompany(data);
    this.logger.log("saveCompany from getUserInfo.");
    return response;
  }

  public async getCompanyList(data: getCompanyListDTO): Promise<any> {
    this.logger.log("getCompanyList has been initiated.");
    const response = await this.dbHelperService.getCompanyList(data);
    this.logger.log("getCompanyList from getUserInfo.");
    return response;
  }

  public async getInvitationList(data: getCompanyListDTO): Promise<any> {
    this.logger.log("getInvitationList has been initiated.");
    const response = await this.dbHelperService.getInvitationList(data);
    this.logger.log("getInvitationList from getUserInfo.");
    return response;
  }

  public async getEmployeeList(data: getCompanyListDTO): Promise<any> {
    this.logger.log("getEmployeeList has been initiated.");
    const response = await this.dbHelperService.getEmployeeList(data);
    this.logger.log("getEmployeeList from getUserInfo.");
    return response;
  }

  public async getCompanyById(data: getCompanyListDTO): Promise<any> {
    this.logger.log("getCompanyById has been initiated.");
    const response = await this.dbHelperService.getCompanyIdById(data);
    this.logger.log("getCompanyById from getUserInfo.");
    return response;
  }

  public async completeRegistration(dto: UserRegistrationDTO): Promise<any> {
    this.logger.log("completeRegistration has been initiated.");
    const response = await this.dbHelperService.completeRegistration(dto);
    this.logger.log("Returning from completeRegistration.");
    return response;
  }

  public async inviteUser(userInfo: InviteUserDTO) {
    this.logger.log("inviteUser has been initiated.");

    const response = await this.dbHelperService.inviteUser(userInfo);
    if (response.isSuccess) {
      const courier = CourierClient({
        authorizationToken: process.env.EMAIL_API_KEY,
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
