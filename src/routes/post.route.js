import express from "express";
import {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getAllUserPost,
  getPost,
} from "../controllers/post.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();

router.route("/socialFeed").get(getAllPosts);
router
  .route("/")
  .get(authenticateUser, getAllUserPost)
  .post(authenticateUser, createPost);

router
  .route("/:id")
  .get(authenticateUser, getPost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);

export default router;
