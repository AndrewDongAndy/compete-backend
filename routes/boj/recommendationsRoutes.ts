import { Router } from "express";
import { recommendationsGet } from "../../controllers/boj/recommendationsController";

const router = Router();

router.get("/boj/recommendations", recommendationsGet);

export default router;
