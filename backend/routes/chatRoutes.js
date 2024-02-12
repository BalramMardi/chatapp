import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  accessChat,
  addUser,
  createGroup,
  fetchChat,
  removeUser,
  renameGroup,
} from "../controllers/chatControll.js";

const router = express.Router();

router.post("/", requireSignIn, accessChat);
router.get("/", requireSignIn, fetchChat);

router.post("/create-group", requireSignIn, createGroup);
router.put("/rename-group", requireSignIn, renameGroup);
router.put("/add-user", requireSignIn, addUser);
router.put("/remove-user", requireSignIn, removeUser);

/* 


*/

export default router;
