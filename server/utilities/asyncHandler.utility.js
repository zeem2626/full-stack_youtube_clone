// const asyncHandler = (requestHandler) => (req, res, next) => {
//   Promise.resolve(requestHandler(req, res, next))
//   .catch((error) => next(error));
// };

import { ApiError } from "./ApiError.utility.js";
import { ApiResponse } from "./ApiResponse.utility.js";

const asyncHandler = (requestHandler)=> async (req, res, next)=>{
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    // res.status(404).json(error);
    res.status(error.status || 400).json(new ApiResponse(error.status, error.message));
    next(error);
  }
}

export {asyncHandler};