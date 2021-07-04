import { Router } from "express";
import { userGet } from "../controllers/userController";

const router = Router();

router.get("/user", userGet);

export default router;
