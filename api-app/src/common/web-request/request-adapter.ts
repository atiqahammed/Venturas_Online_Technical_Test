/* eslint-disable no-unused-vars */
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, Method } from 'axios';
import { HTTPRequestParam } from '../interfaces/web-request';
require('dotenv').config();

export class RequestAdapter {
  async makeRequest (method: Method, url: string, options: HTTPRequestParam) {
    const config: AxiosRequestConfig = {
      method: method,
      url: url,
      headers: {
        api_key: process.env.CALLBACK_API_KEY || ''
      }
    };

    if (options.body) {
      config.data = options.body;
    }

    // if (options.header) {
    //   config.headers = options.header;
    // }

    try {
      return await axios.request(config);
    } catch (error) {
      throw error.message;
    }
  }

  handleError (error: AxiosError): AxiosError | AxiosResponse['data'] {
    if (error.isAxiosError && error.response) {
      return error.response.data;
    }
    return error;
  }
}
