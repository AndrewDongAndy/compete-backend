import { Router } from "express";
import { recsGet } from "../../controllers/cf/recsController";

const router = Router();

router.get("/cf/recs", recsGet);

export default router;
