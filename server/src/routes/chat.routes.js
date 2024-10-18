import { Router } from "express";
import { deleteParticipantAndMessages, getUserChat, getUserParticipants } from "../controllers/chat.contr.js";
import auth from "../middlewares/auth.js";

let router = new Router();

router.get("/getUserChat/:receiverId",auth, getUserChat);
router.get("/getUserParticipants",auth, getUserParticipants);
router.delete("/delete/:receiverId",auth, deleteParticipantAndMessages);

export default router;