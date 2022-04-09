import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response {
  status: string;
  messages: Array<string>;
  data: Record<string, unknown>;
  functionName?: string;
  project?: string;
}

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    const res: Response = {
      status: 'success',
      messages: [],
      data: {},
    };

    return next
      .handle()
      .pipe(map((data) => {
        /*
        if (Array.isArray(data)) {
          res.data['total'] = data.length;
          res.data['data'] = data;
        } else {
          res.data = data;
        }
        */
        res.data = data;

        if (data?.additionalMessage) {
          res.messages = Array.isArray(data?.additionalMessage) ? data?.additionalMessage : [data?.additionalMessage];
          res.status = 'success';
          data.additionalMessage = undefined;
        }

        if (typeof data === 'object') {
          res.functionName = data?.functionName;
          res.project = data?.partner;

          data['functionName'] = undefined;
          data['partner'] = undefined;
        }

        return res;
      }));
  }
}
