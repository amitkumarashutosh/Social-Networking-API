import express from "express";
import {
  follow,
  unFollow,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();

router.route("/follow").post(authenticateUser, follow);
router.route("/unfollow").post(authenticateUser, unFollow);
router.route("/following").get(authenticateUser, getFollowing);
router.route("/followers").get(authenticateUser, getFollowers);

export default router;
