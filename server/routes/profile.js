import { Router } from "express";
import {
  getProfile,
  getFollowers,
  follow,
  unfollow,
  removeFollower,
  getFollowing,
  checkUsernameAvailability,
} from "../controllers/profile.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { establishNewConversation } from "../middleware/conversation.js";

const router = Router();

/*READ*/
router.get("/", verifyId, getProfile);
router.get("/following", verifyId, getFollowing);
router.get("/followers", verifyId, getFollowers);
router.post(
  "/check_username_availability",
  verifyId,
  checkUsernameAvailability
);

/*UPDATE*/
router.patch(
  "/follow",
  verifyId,
  verifyToken,
  establishNewConversation,
  follow
);
router.patch("/unfollow", verifyId, verifyToken, unfollow);
router.patch("/remove_follower", verifyId, verifyToken, removeFollower);
export default router;
