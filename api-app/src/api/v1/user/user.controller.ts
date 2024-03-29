import { Body, Controller, Post } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { UserService } from "./services/user.service";
import { InviteUserDTO, UpdateProfileDTO, UserRegistrationDTO } from "./dto/invite-user.dto";
import { LoginDTO } from "./dto/user-info.dto";
import { getCompanyListDTO, SaveCompanyDTO, UpdateCompanyDTO } from "./dto/user-type.dto";

@Controller("api/v1")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly UserService: UserService) {}

  @Post("invite-user")
  @ApiOperation({
    description: "This api is for inviting user with user email address",
    summary: "invite a user for creating user account.",
  })
  public async inviteUser(
    @Body() body: InviteUserDTO
  ): Promise<any> {
    this.logger.log(`inviteUser has been initiated`);

    try {
      const response = await this.UserService.inviteUser(body);
      return response;
    }catch(error) {
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("complete-user-registration")
  @ApiOperation({
    description: "This api is for completing user registration",
    summary: "complete a user registration with user information.",
  })
  public async completeUserRegistration(
    @Body() body: UserRegistrationDTO
  ): Promise<any> {
    this.logger.log(`completeUserRegistration has been initiated`);

    try {
      const response = await this.UserService.completeRegistration(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("login")
  @ApiOperation({
    description: "This api is for user log in",
    summary: "login user with email and password",
  })
  public async login(
    @Body() body: LoginDTO
  ): Promise<any> {
    this.logger.log(`login has been initiated`);

    try {
      const response = await this.UserService.loginUser(body);
      return response;
    }catch(error) {
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("save-company")
  @ApiOperation({
    description: "This api is for saving company information",
    summary: "This api is for saving company information",
  })
  public async saveCompany(
    @Body() body: SaveCompanyDTO
  ): Promise<any> {
    this.logger.log(`saveCompany has been initiated`);

    try {
      const response = await this.UserService.saveCompany(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("get-company-list")
  @ApiOperation({
    description: "This api is for getting company information",
    summary: "This api is for saving company information",
  })
  public async getCompany(
    @Body() body: getCompanyListDTO
  ): Promise<any> {
    this.logger.log(`getCompany has been initiated`);

    try {
      const response = await this.UserService.getCompanyList(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("get-invitation-list")
  @ApiOperation({
    description: "This api is for getting invitation information",
    summary: "This api is for saving invitation information",
  })
  public async invitationList(
    @Body() body: getCompanyListDTO
  ): Promise<any> {
    this.logger.log(`invitationList has been initiated`);

    try {
      const response = await this.UserService.getInvitationList(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("get-employee-list")
  @ApiOperation({
    description: "This api is for getting employee information",
    summary: "This api is for saving employee information",
  })
  public async employeeList(
    @Body() body: getCompanyListDTO
  ): Promise<any> {
    this.logger.log(`employeeList has been initiated`);

    try {
      const response = await this.UserService.getEmployeeList(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }
  @Post("get-company")
  @ApiOperation({
    description: "This api is for getting company information",
    summary: "This api is for saving company information",
  })
  public async getCompanyById(
    @Body() body: getCompanyListDTO
  ): Promise<any> {
    this.logger.log(`getCompanyById has been initiated`);

    try {
      const response = await this.UserService.getCompanyById(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("update-company")
  @ApiOperation({
    description: "This api is for updating company information",
    summary: "This api is for updating company information",
  })
  public async updateCompany(
    @Body() body: UpdateCompanyDTO
  ): Promise<any> {
    this.logger.log(`updateCompany has been initiated`);

    try {
      const response = await this.UserService.updateCompany(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }

  @Post("update-profile")
  @ApiOperation({
    description: "This api is for updating profile information",
    summary: "This api is for updating profile information",
  })
  public async updateProfile(
    @Body() body: UpdateProfileDTO
  ): Promise<any> {
    this.logger.log(`updateProfile has been initiated`);

    try {
      const response = await this.UserService.updateProfile(body);
      return response;
    }catch(error) {
      console.log(error);
      return {
        isSuccess: false,
        message: `Something went wrong. Please Try again later.`
      }
    }
  }
}
