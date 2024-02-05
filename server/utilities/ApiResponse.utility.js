class ApiResponse {
  constructor(status, message = "Success", data,) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.success = status < 400;
  }
}

export { ApiResponse };
