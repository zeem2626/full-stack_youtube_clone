import { Router } from "express";
import {
   addComment,
   getComment,
   updateComment,
   deleteComment,
} from "../controllers/comment.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/:videoId", getComment);
router.post("/:videoId", verifyUser, addComment);
router.put("/:commentId", verifyUser, updateComment);
router.delete("/:commentId", verifyUser, deleteComment);

export default router;
