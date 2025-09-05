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
import { getUserInfo, verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { newConversationByFollow } from "../middleware/conversation.js";

const router = Router();

/*READ*/
router.get("/", verifyId, getUserInfo, getProfile);
router.get("/following", verifyId, getUserInfo, getFollowing);
router.get("/followers", verifyId, getUserInfo, getFollowers);
router.post(
  "/check_username_availability",
  verifyId,
  checkUsernameAvailability
);

/*UPDATE*/
router.patch("/follow", verifyId, verifyToken, newConversationByFollow, follow);
router.patch("/unfollow", verifyId, verifyToken, unfollow);
router.patch("/remove_follower", verifyId, verifyToken, removeFollower);
export default router;
