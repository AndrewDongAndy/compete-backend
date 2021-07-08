import { Router } from "express";

import { userGet } from "../controllers/userController";

const router = Router();

router.get("/user/:username", userGet);

export default router;
