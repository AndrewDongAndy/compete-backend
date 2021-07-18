import { Router } from "express";

import { problemGet } from "../../controllers/boj/problemController";

const router = Router();

router.get("/boj/problem/:id", problemGet);

export default router;
