import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInfo } from "../../../../model/user.info.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { LoginDTO } from "../dto/user-info.dto";
import { InviteUserDTO, UserRegistrationDTO } from "../dto/invite-user.dto";
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

  async completeRegistration(data: UserRegistrationDTO): Promise<any> {
    this.logger.log(`completeRegistration has been initiated.`);
    let result = await this.invitationRepo.findOne({
      where: { UUID: data.uuid },
    });

    if (!result) {
      return {
        isSuccess: false,
        message: `Invitation not exists with id: ${data.uuid}.`,
      };
    }

    if (result.Status != "pending") {
      return {
        isSuccess: false,
        message: `Invitation has been expired.`,
      };
    }

    let user = await this.userInfoRepo.findOne({
      where: { Email: result.Email },
    });

    if (user) {
      return {
        isSuccess: false,
        message: `User already exists with same email.`,
      };
    }

    const passwordCheck = await bcrypt.compare(
      data.temporaryPassword,
      result.TemporaryPassword
    );

    if (!passwordCheck) {
      return {
        isSuccess: false,
        message: `Invalid Password`,
      };
    }

    result.Status = "complete";
    await this.invitationRepo.save(result);

    let newUser = new UserInfo();
    newUser.Email = result.Email;
    newUser.Name = data.name;
    newUser.Department = data.department;
    newUser.CompanyId = result.CompanyId;
    newUser.UserType = result.UserType;
    newUser.Remarks = data.remarks;
    newUser.DateOfBirth = data.dateOfBirth;
    newUser.PhoneNumber = data.phoneNumber;
    newUser.Address = data.address;
    newUser.ZipCode = data.zipCode;
    const saltRounds =
      (Math.floor(Math.random() * data.password.length) + 1000) % 1000;
    newUser.Password = await bcrypt.hash(data.password, saltRounds);

    await this.userInfoRepo.save(newUser);

    this.logger.log(`returning from completeRegistration.`);
    return {
      isSuccess: true,
      message: "Account Created Successfully.",
    };
  }

  async getUserInfo(): Promise<any[]> {
    this.logger.log(`getUserInfo has been initiated.`);
    let result;
    let response: any[] = new Array();
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

  async loginInUser(data: LoginDTO): Promise<any> {
    this.logger.log(`loginInUser has been initiated.`);

    const userWithEmail = await this.userInfoRepo.findOne({
      where: {
        Email: data.email,
      },
    });

    if (!userWithEmail || !userWithEmail.Email) {
      return {
        isSuccess: false,
        message: "Invalid user credential.",
      };
    }

    const passwordCheck = await bcrypt.compare(
      data.password,
      userWithEmail.Password
    );
    if (!passwordCheck) {
      return {
        isSuccess: false,
        message: "Invalid user credential.",
      };
    }

    return {
      isSuccess: true,
      message: "Login Success",
      user: userWithEmail,
    };
  }

  async inviteUser(userInfo: InviteUserDTO): Promise<any> {
    this.logger.log(`inviteUser has been initiated.`);

    const existingUsers = await this.invitationRepo.find({
      where: {
        Email: userInfo.email,
        Status: "completed",
      },
    });

    if (existingUsers && existingUsers.length > 0) {
      return {
        isSuccess: false,
        message: `User already exists with email: ${userInfo.email}`,
      };
    }

    let inviation = new Invitation();
    inviation.Email = userInfo.email;
    inviation.CompanyId = userInfo.companyId;
    inviation.UserType = userInfo.userType;
    inviation.InvitedBy = userInfo.invitedBy;
    inviation.Status = "pending";
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
      password: password,
    };
  }
}
