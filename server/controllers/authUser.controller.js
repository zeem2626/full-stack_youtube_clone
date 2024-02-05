import { User } from "../models/user.model.js";
import { ApiError } from "../utilities/ApiError.utility.js";
import { ApiResponse } from "../utilities/ApiResponse.utility.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";

const signup = asyncHandler(async (req, res, next) => {
   const { fullName, userName, email, password } = req.body;

   let invalid = [userName, fullName, email, password].some(
      (elem) => (!elem || elem.trim() == "")
   );
   if (invalid) {
      throw new ApiError(400, "Give required details");
   }

   const userExist = await User.findOne({ $or: [{ userName }, { email }] });
   if (userExist) {
      throw new ApiError(409, "Username or Email already exists");
   }

   const newUser = await User.create({ fullName, userName, email, password });

   const { ...data } = newUser._doc;
   delete data.password;

   res.status(200).json(
      new ApiResponse(200, "User created successfully ", data)
   );
});

const login = asyncHandler(async (req, res) => {
   const { usernameOrEmail, password } = req.body;

   if (!usernameOrEmail || !password) {
      throw new ApiError(409, "Username/Email And Password are required");
   }
   if (usernameOrEmail.trim() == "" || password.trim() == "") {
      throw new ApiError(409, "Username/Email And Password are required");
   }

   const user = await User.findOne({
      $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
   });

   if (!user) {
      throw new ApiError(409, "User does not exist");
   }

   const isPasswordCorrect = await user.isPasswordCorrect(password);

   if (!isPasswordCorrect) {
      throw new ApiError(409, "Wrong Password");
   }

   const accessToken = user.generateAccessToken();

   // const options = { httpOnly: true, secure: true, maxAge: 10 };
   const options = { httpOnly: true, secure: true, maxAge: 120 * 60000 };

   const { ...userData } = user._doc;
   delete userData.password;

   res.status(200)
      .cookie("accessToken", accessToken, options)
      .json(
         new ApiResponse(200, "User Logged In Successfully", {
            accessToken,
            user: userData,
         })
      );
});

const googleSignin = asyncHandler(async (req, res) => {
   const { uid, fullName, email } = req.body;

   const incompleteDetails = [uid, fullName, email].some(
      (elem) => !elem || elem.trim() == ""
   );
   if (incompleteDetails) {
      throw new ApiError(400, "Incomplete Details");
   }

   let user = await User.findOne({ $or: [{ uid }, { email }] });
   if (!user) {
      user = await User.create({
         fullName,
         userName: uid,
         email,
         googleUserId: uid,
         password: ""
      });
   }

   const accessToken = user.generateAccessToken();

   const { ...userData } = user._doc;
   delete userData.password;

   const options = { httpOnly: true, secure: true, maxAge: 60 * 60000 };

   res.status(200)
      .cookie("accessToken", accessToken, options)
      .json(
         new ApiResponse(200, "User Logged In Successfully", {
            accessToken,
            user: userData,
         })
      );
});

const logout = asyncHandler(async (req, res) => {
   const user = req.user;
   res.status(200)
      .clearCookie("accessToken")
      .json(new ApiResponse(200, "User loged out"));
});

export { signup, login, logout, googleSignin };
