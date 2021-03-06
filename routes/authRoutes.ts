import { Router } from "express";
import {
  loginPost,
  logoutPost,
  refreshTokenPost,
  registerPost,
} from "../controllers/authController";
import verifyAccessToken from "../middleware/verifyToken";

const router = Router();

// if sharing stuff between frontend and backend ever works,
// these route strings are also something that could be cleaned up
router.post("/login", loginPost);
router.post("/register", registerPost);
router.post("/logout", verifyAccessToken, logoutPost);
router.post("/refresh-token", refreshTokenPost);

export default router;
