import { Router } from "express";

import {
  // userDelete,
  userGet,
  userInfoPut,
  usersGet,
} from "../controllers/userController";
import verifyAccessToken from "../middleware/verifyToken";

const router = Router();

router.get("/user/:username", userGet);
router.get("/users", usersGet);
router.put("/user-info", verifyAccessToken, userInfoPut);
// router.delete("/user/:username", userDelete);

export default router;
