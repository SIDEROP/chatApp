import { Router } from "express";
import {
  createNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/notification.contr.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/create", auth, createNotification);

router.get("/get", auth, getNotifications);

router.post("/delete/", auth, deleteNotification);

export default router;
