import { Router } from "express";
import { recommendationsGet } from "../../controllers/cf/recommendationsController";

const router = Router();

router.get("/cf/recommendations", recommendationsGet);

export default router;
