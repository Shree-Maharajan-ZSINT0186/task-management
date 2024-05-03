import express from "express";
import userController from "../controller/userController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
router.route("/").get(auth, userController.getUser);
router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/logout").put(userController.logout);
router.route("/updateRole").put(auth, userController.updateRole);

export default router;
