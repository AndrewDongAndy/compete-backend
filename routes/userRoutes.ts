import { Router } from "express";

import { userGet, userInfoPut, usersGet } from "../controllers/userController";

const router = Router();

router.get("/user/:username", userGet);
router.get("/users", usersGet);
router.put("/user-info/:username", userInfoPut);

export default router;
