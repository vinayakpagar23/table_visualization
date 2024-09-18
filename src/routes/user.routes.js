import {Router} from "express";
import { loginUser, registerUser,logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser } from "../controllers/user.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";

const router =Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(validateToken,logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/updatePassword").post(validateToken,changeCurrentPassword);
router.route("./getCurrentUser").post(validateToken,getCurrentUser)

export default router;