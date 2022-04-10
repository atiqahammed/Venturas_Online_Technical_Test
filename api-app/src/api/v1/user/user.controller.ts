import { Body, Controller, Post } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { UserService } from "./services/user.service";
import { InviteUserDTO, UserRegistrationDTO } from "./dto/invite-user.dto";
import { LoginDTO } from "./dto/user-info.dto";
import { SaveCompanyDTO } from "./dto/user-type.dto";

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
}
