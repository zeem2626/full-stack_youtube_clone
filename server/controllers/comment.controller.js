import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utilities/ApiError.utility.js";
import { ApiResponse } from "../utilities/ApiResponse.utility.js";

const addComment = asyncHandler(async (req, res) => {
   const videoId = req.params.videoId;
   const comment = req.body.comment;

   if ([comment, videoId].some((elem) => !elem || elem.trim() == "")) {
      throw new ApiError(400, "Incomplete details");
   }

   const video = await Video.findById(videoId);

   if (!video) {
      throw new ApiError(400, "Video not found");
   }

   const newComment = await Comment.create({
      userId: req.user._id,
      videoId,
      comment,
   });

   res.status(200).json(new ApiResponse(200, "Comment added", newComment));
});

const updateComment = asyncHandler(async (req, res) => {
   const commentId = req.params.commentId;
   const newComment = req.body.newComment;
   const userId = req.user._id;

   if ([commentId, newComment].some((elem) => !elem || elem.trim() == "")) {
      throw new ApiError(400, "Incomplete details");
   }

   const oldComment = await Comment.findById(commentId);

   if (oldComment?.userId != userId) {
      throw new ApiError(400, "Unauthorized updation of comment");
   }

   const updatedcomment = await Comment.findByIdAndUpdate(
      commentId,
      {
         comment: newComment,
      },
      { new: true }
   );

   res.status(200).json(
      new ApiResponse(200, "Comment deleted", updatedcomment)
   );
});

const getComment = asyncHandler(async (req, res) => {
   const videoId = req.params.videoId;

   if (!videoId || videoId.trim() == "") {
      throw new ApiError(400, "Video not found");
   }

   const comments = await Comment.find({ videoId }).sort({createdAt: -1});

   res.status(200).json(
      new ApiResponse(200, "All comments accessed", comments)
   );
});

const deleteComment = asyncHandler(async (req, res) => {
   const commentId = req.params.commentId;
   const userId = req.user._id;

   if (!commentId || commentId.trim() == "") {
      throw new ApiError(400, "Incomplete details");
   }

   const oldComment = await Comment.findById(commentId);

   if (oldComment?.userId != userId) {
      throw new ApiError(400, "Unauthorized deletion of comment");
   }

   const deletedcomment = await Comment.findByIdAndDelete(commentId);

   res.status(200).json(
      new ApiResponse(200, "Comment deleted", deletedcomment)
   );
});

export { addComment, getComment, updateComment, deleteComment };
