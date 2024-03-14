import ApiError from "../utils/error.js";
import { isTokenValid } from "../utils/jwt.js";
import asyncHandler from "../utils/async.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(500, "Authentication Invalid");
  }

  const isValid = isTokenValid(token);
  req.user = {
    username: isValid.payload.username,
    userId: isValid.payload.userId,
  };

  next();
});

const checkPermission = (userId, responseId) => {
  if (userId !== responseId) {
    throw new ApiError(500, "INVALID! Not Allowed");
  }
};

export { authenticateUser, checkPermission };
