import express from "express";
import {
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();

router
  .route("/")
  .get(authenticateUser, getUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, deleteUser);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

export default router;
