import { Injectable, Logger } from "@nestjs/common";
import { ethers } from "ethers";
const crypto = require("crypto");

@Injectable()
export class CommonValidationService {
  private readonly logger = new Logger(CommonValidationService.name);
  private mockProjectList = new Array();

  constructor(
  ) {
  }

  getMetadataDigest(metadata: any): string {
    const messageBytes = ethers.utils.toUtf8Bytes(JSON.stringify(metadata));
    const hash = ethers.utils.sha256(messageBytes);

    return hash;
  }

}
