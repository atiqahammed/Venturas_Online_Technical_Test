import {
  Controller,
  Get,
  Body,
  Post,
  BadRequestException,
  Delete,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation } from "@nestjs/swagger";
import {
  DeleteProjectType,
  SaveProjectType,
  DeleteProject,
  ProjectResponse,
  ProjectTypeResponse,
  CreateProjectRequestDTO,
  TokenAllocationDTO,
  getProjectByIdRequest,
  TokenAllocationBreakdownDTO,CreateSupportProjectDTO
} from "./dto/project.dto";
import { ProjectService } from "./services/project.service";
import { JwtAuthGuard } from "../../auth/tokenAuth/jwt-auth.guard";
import {
  GetContractAddressRequestDTO,
  GetContractAddressResponseDTO,
} from "./dto/contract-address.dto";
import { TxStatus } from "../../../common/enums/tx-status.enum";
import { v4 as uuidv4 } from "uuid";
import { CommonParameter } from "../../../common/dto/common-parameter.dto";


@Controller("api/v1")
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);
  constructor(private service: ProjectService) {}

  @Post("create-project")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to create a project",
    summary: "Create Project",
  })
  public async createProject(@Body() body: CreateProjectRequestDTO): Promise<any> {
    this.logger.log(`createProject has been initiated`);
    let response= await this.service.queueCreateProject(body);
    this.logger.log(`returning from createProject`);
    return response;
  }

  @Get("get-all-projects")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "Get all Project",
    summary: "Get All Project",
  })
  public async getProject(): Promise<any> {
    this.logger.log(`getProject has been initiated`);
    const allProjects = await this.service.getAllProject();
    this.logger.log(`returning from getProject`);
    return allProjects;
  }

  @Post("get-project-by-id")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to Get single project by ID",
    summary: "Get Project by Id",
  })
  public async getProjectById(
    @Body() body: getProjectByIdRequest
  ): Promise<any> {
    this.logger.log(`getProjectById has been initiated`);
    const response = await this.service.getProjectById(body);
    this.logger.log(`returning from getProjectById`);
    return response;
  }


  @Post("get-contract-address-by-project")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description:
      "This endpoint provides projects contract address by address type.",
    summary: "Get contract by project and address type",
  })
  public async getContractAddressByProject(
    @Body() body: GetContractAddressRequestDTO
  ): Promise<GetContractAddressResponseDTO> {
    this.logger.log(`getContractAddressByProject has been initiated`);
    const response = await this.service.getContractAddressByProject(body.projectId);
    this.logger.log(`returning from getContractAddressByProject`);
    return response;
  }

  @Post("allocation-breakdown")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to Toke-Allocation-Breakdown",
    summary: "Token-Allocation-Breakdown",
  })
  public async allocationBreakdown(
    @Body() body: TokenAllocationBreakdownDTO
  ): Promise<CommonParameter> {
    this.logger.log(`allocationBreakdown has been initiated`);
    const response = await this.service.queueAllocationBreakdown(body);
    this.logger.log(`ending allocationBreakdown`);
    return response;
  }

  @Post("token-allocation")
  @ApiOperation({
    description: "This endpoint provides to create Token Allocation",
    summary: "Token-Allocation",
  })
  public async tokenAllocation(@Body() body: TokenAllocationDTO): Promise<any> {
    this.logger.log(`tokenAllocation has been initiated`);
 
    const response = await this.service.queueTokenAllocation(body);
    this.logger.log(`returning from tokenAllocation`);
    return response;
  }
  @Post("support-project")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "Authorization",
  })
  @ApiOperation({
    description: "This endpoint provides to create a support project",
    summary: "Create Support Project",
  })
  public async createSupportProject(@Body() body: CreateSupportProjectDTO): Promise<any> {
    this.logger.log(`createSupportProject has been initiated`);
    let response= await this.service.queueCreateSupportProject(body);
    this.logger.log(`returning from createSupportProject`);
    return response;
  }


}
