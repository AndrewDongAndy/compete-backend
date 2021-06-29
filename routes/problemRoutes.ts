import { Router } from "express";
import { problemsGet } from "../controllers/problemController";

const router = Router();

router.get("/problems", problemsGet);

export default router;
