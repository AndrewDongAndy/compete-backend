import { Router } from "express";

import { problemGet } from "../controllers/problemController";

const router = Router();

router.get("/problem/:id", problemGet);

export default router;
