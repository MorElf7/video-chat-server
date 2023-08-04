export default class HttpException extends Error {
  public status: number;
  public message: string;
  public timestamp: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.timestamp = Date.now();
  }
}
