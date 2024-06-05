class ApiError extends Error {
  public statusCode: number;
  public message: string;
  public data: any | null;
  public success: boolean;
  public errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    data: any | null = null,
    errors: any[] = [],
    stack: string = ""
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
