import { Controller, Get, Headers } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "../../auth/tokenAuth/auth.service";
import { UserService } from "./services/user.service";
import { AuthLoginDto } from "../../../api/auth/tokenAuth/dto/auth.dto";


@Controller("api/v1")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly authService: AuthService) {}

  @ApiOperation({
    description: "This endpoint provides JWT auth token. It's require X-API-KEY and eoa in request header.",
    summary: "Get Authentication Token",
  })
  @Get("get-authentication-token")
  async getAuthenticationToken(
    @Headers("X-API-KEY") apikey: string,
    @Headers("eoa") eoa: string
  ) {
    let authLoginDto = new AuthLoginDto()
    authLoginDto.apikey = apikey;
    authLoginDto.eoa = eoa;
    console.log(authLoginDto);
    return this.authService.login(authLoginDto);
  }
}
