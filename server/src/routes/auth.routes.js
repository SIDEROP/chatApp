import { Router } from "express";
import {login,logout,register, reLogin } from "../controllers/auth.contr.js";
import auth from "../middlewares/auth.js";

let router = new Router();

router.post("/register", register);
router.post("/login", login);
router.post('/reLogin', reLogin);
router.get('/logout', logout);

export default router;
