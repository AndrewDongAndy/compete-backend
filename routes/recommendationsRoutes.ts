import { Router } from "express";
import { recommendationsGet } from "../controllers/recommendationsController";

const router = Router();

router.get("/recommendations", recommendationsGet);

export default router;
