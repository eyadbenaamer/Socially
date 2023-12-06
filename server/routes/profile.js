import { Router } from "express";
import {
  getProfile,
  getFollowers,
  follow,
  unFollow,
  removeFollower,
  getFollowing,
} from "../controllers/profile.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";

const router = Router();

/*READ*/
router.get("/:id", verifyId, getProfile);
router.get("/following/:id", verifyId, getFollowing);
router.get("/followers/:id", verifyId, getFollowers);

/*UPDATE*/
router.patch("/follow/:accountId", verifyId, verifyToken, follow);
router.patch("/unfollow/:accountId", verifyId, verifyToken, unFollow);
router.patch(
  "/remove_follower/:accountId",
  verifyId,
  verifyToken,
  removeFollower
);
export default router;
