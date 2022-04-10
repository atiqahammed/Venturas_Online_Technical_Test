import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInfo } from "../../../../model/user.info.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { LoginDTO } from "../dto/user-info.dto";
import { InviteUserDTO, UpdateProfileDTO, UserRegistrationDTO } from "../dto/invite-user.dto";
import { Invitation } from "../../../../model/invittion.entity";
import { getCompanyListDTO, SaveCompanyDTO, UpdateCompanyDTO } from "../dto/user-type.dto";
import { Company } from "../../../../model/company.entity";

@Injectable()
export class UserTypeDBHelperService {
  private readonly logger = new Logger(UserTypeDBHelperService.name);
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepo: Repository<UserInfo>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>
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

  async saveCompany(dto: SaveCompanyDTO): Promise<any> {
    this.logger.log(`saveCompany has been initiated.`);

    let company = new Company();
    company.Name = dto.name;
    company.CopanyNameKana = dto.companyNameKana;
    company.Address = dto.address;
    company.ZipCode = dto.zipCode;
    company.PhoneNumber = dto.phoneNumber;
    company.DateOfEstablishment = dto.dateOfEstablishment;
    company.URLOfHP = dto.urlOfHP;
    company.Remarks = dto.remarks;
    company.OwnerId = dto.ownerId;
    company.Email = dto.email;

    await this.companyRepo.save(company);

    this.logger.log(`returning from saveCompany.`);
    return {
      isSuccess: true,
      message: "Company Information Saved.",
    };
  }

  async getCompanyList(dto: getCompanyListDTO) {
    this.logger.log(`getCompanyList has been initiated.`);

    let companyList = await this.companyRepo.find({
      where: {
        OwnerId: dto.id,
      },
    });

    this.logger.log(`returning from getCompanyList.`);
    return {
      isSuccess: true,
      companyList,
    };
  }

  async getInvitationList(dto: getCompanyListDTO) {
    this.logger.log(`getInvitationList has been initiated.`);

    let invitationList = await this.invitationRepo.find({
      where: {
        InvitedBy: dto.id,
      },
    });

    this.logger.log(`returning from getInvitationList.`);
    return {
      isSuccess: true,
      invitationList,
    };
  }

  async getEmployeeList(dto: getCompanyListDTO) {
    this.logger.log(`getEmployeeList has been initiated.`);

    const user = await this.userInfoRepo.findOne({
      where: {
        Id: dto.id
      }
    });

    let employeeList = [];

    if(user.CompanyId == 0) {
      const companyList = await this.companyRepo.find({
        where: {
          OwnerId: dto.id
        }
      }); 

      const companyIds = companyList.map(item => item.Id);
      const allUsers = await this.userInfoRepo.find();
      employeeList = allUsers.filter(item => companyIds.includes(item.CompanyId));
    } else {
      employeeList = await this.userInfoRepo.find({
        where: {
          CompanyId: user.CompanyId
        }
      });
    }

    this.logger.log(`returning from getEmployeeList.`);
    return {
      isSuccess: true,
      employeeList,
    };
  }

  async getCompanyIdById(dto: getCompanyListDTO) {
    this.logger.log(`getCompanyIdById has been initiated.`);

    const company = await this.companyRepo.findOne({
      where: {
        Id: dto.id
      }
    })

    this.logger.log(`returning from getCompanyIdById.`);
    return {
      isSuccess: true,
      company,
    };
  }

  async updateCompany(dto: UpdateCompanyDTO) {
    this.logger.log(`updateCompany has been initiated.`);

    let company = await this.companyRepo.findOne({
      where: {
        Id: dto.id
      }
    });

    company.Name = dto.name;
    company.CopanyNameKana = dto.companyNameKana;
    company.Email = dto.email;
    company.Address = dto.address;
    company.ZipCode = dto.zipCode;
    company.DateOfEstablishment = dto.dateOfEstablishment;
    company.PhoneNumber = dto.phoneNumber;
    company.Remarks = dto.remarks;
    company.URLOfHP = dto.urlOfHP;
    
    await this.companyRepo.save(company);

    this.logger.log(`returning from updateCompany.`);
    return {
      isSuccess: true,
      message: "Company Information Saved.",
    };
  }

  async updateProfile(dto: UpdateProfileDTO) {
    this.logger.log(`updateProfile has been initiated.`);

    let user = await this.userInfoRepo.findOne({
      where: {
        Id: dto.id
      }
    });

    user.Name = dto.name;
    user.Address = dto.address;
    user.DateOfBirth = dto.dateOfBirth;
    user.ZipCode = dto.zipCode;
    user.Department = dto.department;
    user.PhoneNumber = dto.phoneNumber;
    user.Remarks = dto.remarks;
    
    await this.userInfoRepo.save(user);

    this.logger.log(`returning from updateProfile.`);
    return {
      isSuccess: true,
      message: "Profile Information Saved.",
    };
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
