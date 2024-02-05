import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { ApiError } from "../utilities/ApiError.utility.js";

const verifyUser = asyncHandler(async (req, res, next) => {
   try {
      const accessToken =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
         throw new ApiError(400, "Unauthorized access");
      }
      const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decode._id).select("-password");

      if (!user) {
         throw new ApiError(400, "Invalid access token");
      }

      req.user = user;
   } catch (error) {
      throw new ApiError(400, error.message || "Something went wrong");
   }
   next();
});

export { verifyUser };
