import { Router } from "express";
import { getAllUsers,changenewUsername } from "../controllers/user.contr.js";
import auth from "../middlewares/auth.js";

let router = new Router();

router.get('/getAllUsers', auth, getAllUsers);
router.put('/changenewUsername', auth, changenewUsername);

export default router;
