import { Injectable, Logger, Module } from '@nestjs/common';
import { WebRequest } from './web-request/web-request';
require('dotenv').config();

@Injectable()
export class CallbackService {
  private readonly CALLBACK_BASE_URL: string;
  private readonly CALLBACK_API_KEY: string;
  private readonly SECONDARY_CALLBACK_BASE_URL: string;
  private readonly INTERNAL_CALLBACK_BASE_URL: string;
  private readonly log = new Logger(CallbackService.name);
  

  constructor() {
    this.CALLBACK_BASE_URL = process.env.TRANSACTION_CALLBACK_URL || `http://localhost:${process.env.PORT}`;
    this.CALLBACK_API_KEY = process.env.CALLBACK_API_KEY || '';
  }

  async reproessCallback(body: any, url: string) {
    const webRequest = new WebRequest();
    let response = null;
    let isError = false;

    try {
      response = await webRequest.httpPost(url, {
        header: {
          api_key: this.CALLBACK_API_KEY 
        },
        body: body
      });

      if (typeof response?.data === 'object') {
        response = JSON.stringify(response.data);
      }

    } catch (e) {
      this.log.error(JSON.stringify(e));
      isError = true;
      response = JSON.stringify(e);
    }
    // await this.updateDraftCallback(body.uuid, !isError ? 'success' : 'draft');
  }

  async callback(body: any, path: string, isDevTest?:boolean) {
    const webRequest = new WebRequest();
    let baseUrlForCallback = this.CALLBACK_BASE_URL;
    const url = `${baseUrlForCallback}/${path}`;
    let response = null;
    let isError = false;

    if (!body.projectId) {
      throw new Error('Invalid projectId');
    }

    const projectId = body.projectId;
    this.log.log(`Sending Callback Request with body: ${JSON.stringify(body)}`);

    try {
      this.log.log(`sending callback to ${url}`);
      const option = {
        header: {
          api_key: this.CALLBACK_API_KEY 
        },
        body: body
      }
      this.log.log(`callback data: ${JSON.stringify(option)}`);
      response = await webRequest.httpPost(url, option);
      if (typeof response?.data === 'object') {
        response = JSON.stringify(response.data);
        this.log.log('Callback Response: ' + response);
      }
      return {
        isError,
        response
      };
    } catch (e) {
      this.log.error(JSON.stringify(e));
      isError = true;
      response = JSON.stringify(e);
      return {
        isError,
        response
      };
    }
  }
}

@Module({
  controllers: [],
  providers: [CallbackService],
  exports: [CallbackService],
})

export class CallbackModule { }
