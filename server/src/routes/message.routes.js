import { Router } from "express";
import { deleteMessage, sendMessage } from "../controllers/message.contr.js";
import auth from "../middlewares/auth.js";

let router = new Router();

router.post("/sendMessage/:receiverId",auth, sendMessage)
.delete("/delete/:receiverId",auth, deleteMessage);

export default router;
