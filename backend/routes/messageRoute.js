import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { allMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:chatid", requireSignIn, allMessage);
router.post("/", requireSignIn, sendMessage);

export default router;
