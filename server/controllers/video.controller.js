import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utilities/ApiError.utility.js";
import { ApiResponse } from "../utilities/ApiResponse.utility.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";

const addVideo = asyncHandler(async (req, res) => {
   const { title, tags, description, videoUrl, thumbnailUrl } = req.body;
   const incompleteDetails = [
      title,
      tags,
      description,
      videoUrl,
      thumbnailUrl,
   ].some((elem) => !elem || elem.trim() == "");
   if (incompleteDetails) {
      throw new ApiError(400, "Give required details");
   }

   // upload Video and Thumbnail
   //  const videoUrl = "Thumbnail URL";
   //  const thumbnailUrl = "Thumbnail URL";

   //  const videoThumbnailMissing = [videoUrl, thumbnailUrl].some(
   //     (elem) => !elem || elem.trim() == ""
   //  );
   //  if (videoThumbnailMissing) {
   //     throw new ApiError(400, "Upload video and thumbnail");
   //  }

   const newVideo = new Video({
      userId: req.user._id,
      videoUrl,
      thumbnail: thumbnailUrl,
      title,
      tags: tags.split(","),
      description,
   });
   newVideo.save();

   res.status(200).json(
      new ApiResponse(200, "Video uploaded successfully", newVideo)
   );
});

const updateVideoDetails = asyncHandler(async (req, res) => {
   const videoId = req.params.id;
   const { title, description } = req.body;

   if (!videoId) {
      throw new ApiError(400, "Give video reference");
   }

   const incompleteDetails = [title, description].some(
      (elem) => !elem || elem.trim() == ""
   );
   if (incompleteDetails) {
      throw new ApiError(400, "Give title and description");
   }

   const video = await Video.findById(videoId);

   if (video?.userId != req.user._id) {
      throw new ApiError(400, "Unauthorized access");
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { title, description },
      { new: true }
   );

   res.status(200).json(
      new ApiResponse(200, "Video updated successfully", updatedVideo)
   );
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
   const videoId = req.body.videoId;

   const video = await Video.findById(videoId);

   if (video?.userId != req.user._id) {
      throw new ApiError(400, "Unauthorized access");
   }

   if (!videoId) {
      throw new ApiError(400, "Give video reference");
   }
   // upload new thumbnail
   const newThumbnail = "New updated thumbnail";

   if (!newThumbnail) {
      throw new ApiError(400, "Upload new thumbnail");
   }

   const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { thumbnail: newThumbnail },
      { new: true }
   );

   res.status(200).json(new ApiResponse(200, "Thumnail updated", updatedVideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
   const videoId = req.params.videoId;

   if(!videoId){
     throw new ApiError(400, "Unauthorized deletion");
   }
   const video = await Video.findById(videoId);

   if (video?.userId != req.user._id) {
      throw new ApiError(400, "Unauthorized deletion");
   }

   const deletedVideo = await Video.findByIdAndDelete(videoId);

   res.status(200).json(200, "Video deleted successfully");
});

const getUserVideos = asyncHandler(async (req, res) => {
   const userId = req.params.userId;

   if (!userId) {
      throw new ApiError(400, "User not available");
   }

   const videos = await Video.find({ userId });

   res.status(200).json(new ApiResponse(200, "All user videos", videos));
});
const getVideo = asyncHandler(async (req, res) => {
   const videoId = req.params.id;

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(400, "Video not available");
   }

   res.status(200).json(new ApiResponse(200, "Video Details", video));
});

const addView = asyncHandler(async (req, res) => {
   const videoId = req.params.id;

   const video = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
   if (!video) {
      throw new ApiError(400, "Give correct video reference");
   }

   res.status(200).json(new ApiResponse(200, "View Added"));
});

const randomVideos = asyncHandler(async (req, res) => {
   const random = await Video.aggregate([{ $sample: { size: 20 } }]);
   res.status(200).json(new ApiResponse(200, "Random video accessed", random));
});

const trendVideos = asyncHandler(async (req, res) => {
   const trend = await Video.find().sort({ views: -1 });
   res.status(200).json(new ApiResponse(200, "Trend video accessed", trend));
});

const subscribedVideos = asyncHandler(async (req, res) => {
   const id = req.user._id;
   const user = await User.findById(id);
   const subscribedChannels = user.subscribedChannels;

   let allVideos = [];
   await Promise.all(
      subscribedChannels.map(async (channelId) => {
         const channelVideos = await Video.find({ userId: channelId }).limit(
            10
         );
         channelVideos.forEach((video) => allVideos.push(video));
         return;
      })
   );

   res.status(200).json(
      new ApiResponse(200, "Subscribed video accessed", allVideos)
   );
});

const searchTags = asyncHandler(async (req, res) => {
   const tags = req.query.tags.split(",");

   const videos = await Video.find({ tags: { $in: tags } }).limit(100);

   res.status(200).json(
      new ApiResponse(200, "Related videos accessed", videos)
   );
});

const searchText = asyncHandler(async (req, res) => {
   const search = req.query.q.split(" ");
   let videos = [];
   await Promise.all(
      search.map(async (word) => {
         const qVideos = await Video.find({
            title: { $regex: word, $options: "i" },
         }).limit(50);
         qVideos.forEach((elem) => {
            videos.push(elem);
         });
      })
   );

   res.status(200).json(
      new ApiResponse(200, "Searched videos accessed", videos)
   );
});

export {
   // Secured Routes
   addVideo,
   updateVideoDetails,
   updateVideoThumbnail,
   deleteVideo,
   getVideo,
   getUserVideos,
   subscribedVideos,
   //
   addView,
   randomVideos,
   trendVideos,
   searchTags,
   searchText,
};
