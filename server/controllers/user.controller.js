import { User } from "../models/user.model.js";
import { ApiError } from "../utilities/ApiError.utility.js";
import { ApiResponse } from "../utilities/ApiResponse.utility.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { Video } from "../models/video.model.js";

const getUser = asyncHandler(async (req, res) => {
   const searchValue = req.params.id;
   const user = await User.findById(searchValue);
   // const user = await User.findOne({userName: req.params.id});
   if (!user) {
      throw new ApiError(400, "User not found");
   }
   res.status(200).json(new ApiResponse(200, "Current User", user));
});

const getCurrentUser = asyncHandler(async (req, res) => {
   const user = req.user;

   if (!user) {
      throw new ApiError(400, "Unauthorized access");
   }

   const accessToken = user.generateAccessToken();

   const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 24 * 60 * 60 * 1000,
      //         1day   1hour  1min    1sec
   };

   res.status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "Current user verified", { user }));
});

const changePassword = asyncHandler(async (req, res) => {
   const { password } = req.body;

   const user = await User.findById(req.user._id);

   if (!user) {
      throw new ApiError(400, "Unauthorized access, user not available");
   }

   user.password = password;
   await user.save();
   // await user.save({ validateBeforeSave: false });

   res.status(200).json(new ApiResponse(200, "Password Changed Successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
   const { fullName, userName, email } = req.body;

   const invalidDetails = [fullName, userName, email].some(
      (elem) => !elem || elem.trim() == ""
   );

   if (invalidDetails) {
      throw new ApiError(400, "Give required details");
   }

   const userExist = await User.findOne({ $or: [{ userName }, { email }] });

   if (userExist && String(userExist._id) != String(req.user._id)) {
      throw new ApiError(400, "Username or email already exist");
   }

   const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, userName, email },
      { new: true }
   ).select("-password");

   res.status(200).json(new ApiResponse(200, "User updated", updatedUser));
});

const updateAvatar = asyncHandler(async (req, res) => {
   const avatar = req.body.avatar;

   if (!avatar || avatar.trim() == "") {
      throw new ApiError(400, "Avatar file missing");
   }

   const avatarUpdated = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
   );

   res.status(200).json(
      new ApiResponse(200, "Avatar updated successfully", avatarUpdated)
   );
});

const deleteUser = asyncHandler(async (req, res) => {
   const deletedUser = await User.findByIdAndDelete(req.user._id);
   res.status(200).json(new ApiResponse(200, "User Deleted"));
});

const subscribe = asyncHandler(async (req, res) => {
   const channelId = req.params.channelId;
   const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
         $addToSet: { subscribedChannels: channelId },
      },
      { new: true }
   );

   const updatedChannel = await User.findByIdAndUpdate(
      channelId,
      {
         $addToSet: { subscribers: req.user._id },
      },
      { new: true }
   );

   res.status(200).json(
      new ApiResponse(200, "Subscribed successfully", updatedChannel)
   );
});

const unsubscribe = asyncHandler(async (req, res) => {
   const channelId = req.params.channelId;
   const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
         $pull: { subscribedChannels: channelId },
      },
      { new: true }
   );

   const updatedChannel = await User.findByIdAndUpdate(
      channelId,
      {
         $pull: { subscribers: req.user._id },
      },
      { new: true }
   );

   res.status(200).json(
      new ApiResponse(200, "Unsubscribed successfully", updatedChannel)
   );
});

const likeVideo = asyncHandler(async (req, res) => {
   const videoId = req.params.videoId;
   const id = req.user._id;

   if (!videoId || videoId.trim() == "") {
      throw new ApiError(400, "Video not found");
   }

   // let liked = await Video.find({ likes: {$elemMatch: {id}}});
   // let liked = await Video.find({ likes: {$elemMatch: {id}}});

   // if (!liked) {
   //    liked = await Video.findByIdAndUpdate(
   //       videoId,
   //       {
   //          $addToSet: { likes: req.user._id },
   //       },
   //       { new: true }
   //    );
   // } else {
   //    liked = await Video.findByIdAndUpdate(
   //       videoId,
   //       {
   //          $pull: { likes: req.user._id },
   //       },
   //       { new: true }
   //    );
   // }

   const liked = await Video.findByIdAndUpdate(
      videoId,
      {
         $addToSet: { likes: req.user._id },
         $pull: { dislikes: req.user._id },
      },
      { new: true }
   );
   res.status(200).json(new ApiResponse(200, "Liked the video", liked));
});

const dislikeVideo = asyncHandler(async (req, res) => {
   const videoId = req.params.videoId;

   if (!videoId || videoId.trim() == "") {
      throw new ApiError(400, "Video not found");
   }

   const dislikedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
         $addToSet: { dislikes: req.user._id },
         $pull: { likes: req.user._id },
      },
      { new: true }
   );

   res.status(200).json(new ApiResponse(200, "Liked the video", dislikedVideo));
});

export {
   getUser,
   getCurrentUser,
   changePassword,
   updateUserDetails,
   updateAvatar,
   deleteUser,
   likeVideo,
   dislikeVideo,
   subscribe,
   unsubscribe,
};
