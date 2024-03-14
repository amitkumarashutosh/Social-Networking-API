import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.js";
import ApiError from "../utils/error.js";

const follow = asyncHandler(async (req, res) => {
  const { followUserId } = req.body;
  const { userId } = req.user;

  const followUser = await User.findById(followUserId);
  if (!followUser) {
    throw new ApiError(404, "User not found");
  }

  const existingUser = await Follow.findOne({ createdBy: userId });
  if (existingUser && existingUser.following.includes(followUserId)) {
    console.log(existingUser);
    return res.status(400).json({ msg: "User already followed" });
  }

  if (existingUser) {
    existingUser.following.push(followUserId);
    await existingUser.save();
  } else {
    const follow = await Follow.create({
      createdBy: userId,
      following: [followUserId],
    });
  }
  res.status(200).json({ msg: "User followed successfully" });
});

const unFollow = asyncHandler(async (req, res) => {
  const { unFollowUserId } = req.body;
  const { userId } = req.user;

  const followUser = await User.findById(unFollowUserId);
  if (!followUser) {
    throw new ApiError(404, "User not found");
  }

  const existingUser = await Follow.findOne({ createdBy: userId });
  if (!existingUser && !existingUser.following.includes(unFollowUserId)) {
    console.log(existingUser);
    return res.status(400).json({ msg: "User anot allowed" });
  }

  existingUser.following = existingUser.following.filter(
    (id) => id.toString() !== unFollowUserId
  );
  await existingUser.save();

  res.status(200).json({ msg: "User unfollowed successfully" });
});

const getFollowing = asyncHandler(async (req, res) => {
  const following = await Follow.find({ createdBy: req.user.userId }).populate(
    "following",
    "username"
  );

  res.status(200).json(following);
});

const getFollowers = asyncHandler(async (req, res) => {
  const followers = await Follow.find({ following: req.user.userId }).populate(
    "following",
    "username"
  );

  const modifiedFollowers = followers.map((follower) => {
    return {
      _id: follower._id,
      createdBy: follower.createdBy,
      followers: follower.following,
    };
  });
  res.status(200).json(modifiedFollowers);
});

export { follow, unFollow, getFollowing, getFollowers };
