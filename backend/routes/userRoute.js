import express from "express";
import {
  registerController,
  loginController,
  testController,
  getCurrentUser,
  searchUser,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

//router
const router = express.Router();

//register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//current-user
router.get("/current-user", requireSignIn, getCurrentUser);

//search
router.get("/", requireSignIn, searchUser);

//testRoute
router.get("/test", requireSignIn, testController);

export default router;
