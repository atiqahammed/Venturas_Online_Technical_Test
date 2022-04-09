import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ErrorType } from '../enums/error-type.enum';
import BaseApiException from './base-api-exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly log = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void | HttpException {

    if(exception != null && typeof exception === 'string') {
      let firstWord = exception.split(" ")[0];
      if((<any>Object).values(ErrorType).includes(firstWord)) {
        this.log.error(`exception: ${exception}`);
      } else {
        this.log.error(`exception: ${ErrorType.CriticalError} ${exception}`);
      }
    } else {
      this.log.error(`exception: ${exception}`);
    }

    if (host.getType().toString() === 'graphql') {
      return exception as HttpException;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      // Extract the message - either string or response.message
      const response = exception.getResponse();
      if (typeof response === 'object') {
        if (Array.isArray((response as any).message)) {
          message = (response as any).message;
        } else {
          message.push((response as any).message);
        }
      } else {
        message.push(response);
      }

    } else if (exception instanceof BaseApiException) {
      statusCode = HttpStatus.BAD_REQUEST;
      const error: Error = exception;
      message.push(error.message);
      if (error.stack) {
        // info level as this is extra information:
        this.log.log(`stack: ${error.stack}`);
      }
    } else if (exception instanceof Error) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      // return general error rather than pass through the error.message
      // as this is a catch all we don't know the error message may reveal and
      // previously we were leaking SQL errors this way (see API-737)
      message.push('Internal Server Error');
      const error: Error = exception;
      if (error.stack) {
        // info level as this is extra information:
        this.log.log(`stack: ${error.stack}`);
      }
    } else {
      // Catch all if we get something other than an Error.
      // Are there any other possible types that could end up here?
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message.push('Internal Server Error');
      // info level as this is extra information:
      this.log.log(`Unhandled error: ${exception}`);
    }

    // if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
    //   Sentry.captureException(exception);
    // }

    const responseBody = {
      status: 'failed',
      data: null,
      messages: message,
    };

    this.log.log(`response: ${JSON.stringify(responseBody, null, 2)}`);

    response.status(statusCode).json(responseBody);
  }
}
