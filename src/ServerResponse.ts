class ServerResponse<T> {
  public code: number;
  public message: string;
  public obj: T | null;

  constructor(code: number, message: string, obj: T | null) {
    this.code = code;
    this.message = message;
    this.obj = obj;
  }
}
