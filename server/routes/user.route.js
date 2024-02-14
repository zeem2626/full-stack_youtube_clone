import { Router } from "express";
import {
   signup,
   login,
   logout,
   googleSignin,
} from "../controllers/authUser.controller.js";
import {
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
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", login);
router.post("/auth/googleSignin", googleSignin);

// Secure Routes
router.get("/current-user", verifyUser, getCurrentUser);
router.post("/change-password", verifyUser, changePassword);
router.post("/update-user", verifyUser, updateUserDetails);
router.post("/update-avatar", verifyUser, updateAvatar);
router.get("/delete-user", verifyUser, deleteUser);
router.get("/subscribe/:channelId", verifyUser, subscribe);
router.get("/unsubscribe/:channelId", verifyUser, unsubscribe);

router.get("/like/:videoId", verifyUser, likeVideo);
router.get("/dislike/:videoId", verifyUser, dislikeVideo);
router.get("/:id", getUser);

router.get("/auth/logout", verifyUser, logout);

export default router;
