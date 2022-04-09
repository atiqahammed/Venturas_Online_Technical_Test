// import { app } from '../../config/global';
import { HTTPRequestOption } from '../interfaces/web-request';
import { RequestAdapter } from './request-adapter';

export class WebRequest extends RequestAdapter {
    baseURL: string;

  constructor () {
    super();
    this.baseURL = '';
  }

  concatenateUrl (urlPath: string): string {
    return this.baseURL + urlPath;
  }

  async httpPost (urlPath: string, options: HTTPRequestOption) {
    // for now dont concat url
    return await this.makeRequest('post', urlPath, options);
  }
}
