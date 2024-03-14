import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.js";
import ApiError from "../utils/error.js";
import { createJWT } from "../utils/jwt.js";

const registerUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  const token = createJWT({ username: user.username, userId: user._id });

  const oneDay = 1000 * 60 * 60 * 24;
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
    })
    .status(201)
    .json({ success: true, token });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(401, "Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentails!");
  }

  const token = createJWT({ username: user.username, userId: user._id });

  const oneDay = 1000 * 60 * 60 * 24;
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
    })
    .status(200)
    .json({ success: true, token });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new ApiError(500, "Something went wrong!");
  }
  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
  });
  if (!user) {
    throw new ApiError(500, "Something went wrong!");
  }

  const token = createJWT({ username: user.username, userId: user._id });

  const oneDay = 1000 * 60 * 60 * 24;
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
    })
    .status(201)
    .json({ success: true, token });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete(req.user.userId);
  if (!user) {
    throw new ApiError(500, "Something went wrong!");
  }

  res.cookie("token", "delete", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user deleted successfully!" });
});

const logoutUser = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logged out!" });
};

export { getUser, registerUser, updateUser, deleteUser, loginUser, logoutUser };
