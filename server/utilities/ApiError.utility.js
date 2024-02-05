class ApiError extends Error {
   constructor(status, message = "Something went wrong") {
      super(message);
      this.status = status;
      this.success = false;
   }
}

export { ApiError };
