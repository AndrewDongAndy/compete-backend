import { Router } from "express";
import { recsGet } from "../../controllers/boj/recsController";

const router = Router();

router.get("/boj/recs", recsGet);

export default router;
