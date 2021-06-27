import { Router } from "express";
import { problemsGet } from "../controllers/problems";

const router = Router();

router.get("/problems", problemsGet);

export default router;
