import { Router } from "express";
import { recsGet } from "../controllers/recsController";

const router = Router();

router.get("/:platform/recs", recsGet);

export default router;
