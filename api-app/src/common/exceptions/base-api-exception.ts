export default abstract class BaseApiException extends Error {
  abstract name: string;
  constructor(message: string) {
    super(message);
  }
}

export class NftAlreadyExistsException extends BaseApiException {
  name = 'NftAlreadyExistsException';
  data: any;
  constructor(message: string, data?: any) {
    super(message);

    this.data = data;
  }
}
