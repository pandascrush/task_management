class ApiResponse {
  status: boolean;
  message: string;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    this.status = statusCode < 400;
    this.message = message;
    if (data !== undefined) this.data = data;
  }
}

export default ApiResponse;
