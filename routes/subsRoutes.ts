import { Router } from "express";
import { subsGet } from "../controllers/subsController";

const router = Router();

router.get("/:platform/subs", subsGet);

export default router;
