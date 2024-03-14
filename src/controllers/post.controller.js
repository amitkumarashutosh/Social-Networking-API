import { Post } from "../models/post.model.js";
import asyncHandler from "../utils/async.js";
import ApiError from "../utils/error.js";
import { checkPermission } from "../middlewares/authentication.js";

const getAllPosts = asyncHandler(async (req, res) => {
  const post = await Post.find({}).sort({ createdAt: -1 });
  res.status(200).json({ post, count: post.length });
});

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  req.body.createdBy = req.user.userId;
  if (!content) {
    throw new ApiError(500, "Please provide content");
  }
  const post = await Post.create(req.body);
  res.status(201).json(post);
});

const getAllUserPost = asyncHandler(async (req, res) => {
  const posts = await Post.find({ createdBy: req.user.userId }).sort({
    createdAt: -1,
  });
  if (!posts) {
    throw new ApiError(500, "Your posts is empty");
  }
  res.status(200).json({ posts, count: posts.length });
});

const getPost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new ApiError(500, `No post is present with id ${postId}`);
  }

  const postUserId = post.createdBy.toString();
  checkPermission(req.user.userId, postUserId);
  res.status(200).json(post);
});

const deletePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new ApiError(500, `No post is present with id ${postId}`);
  }
  const postUserId = post.createdBy.toString();
  checkPermission(req.user.userId, postUserId);

  await Post.findOneAndDelete(postId);
  res.status(200).json({ msg: "post deleted successfully" });
});

const updatePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new ApiError(500, `No post is present with id ${postId}`);
  }
  const postUserId = post.createdBy.toString();
  checkPermission(req.user.userId, postUserId);

  if (req.body.content) {
    throw new ApiError(500, "Please provide content");
  }

  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, req.body, {
    new: true,
  });
  res.status(200).json(updatedPost);
});

export {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getAllUserPost,
  getPost,
};
