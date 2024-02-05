import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import {
   addVideo,
   updateVideoDetails,
   updateVideoThumbnail,
   deleteVideo,
   getVideo,
   getUserVideos,
   addView,
   randomVideos,
   trendVideos,
   subscribedVideos,
   searchTags,
   searchText,
} from "../controllers/video.controller.js";

const router = Router();

router.get("/view/:id", addView);
router.get("/random", randomVideos);
router.get("/trend", trendVideos);
router.get("/subscribed", verifyUser, subscribedVideos);
router.get("/tags", searchTags);
router.get("/search", searchText);
router.get("/get/:id", getVideo);
router.get("/get/my/:userId", getUserVideos);

// Secure Routes
router.post("/upload", verifyUser, addVideo);
router.put("/update-thumbnail", verifyUser, updateVideoThumbnail);
router.put("/update", verifyUser, updateVideoDetails);
router.delete("/:videoId", verifyUser, deleteVideo);

export default router;
