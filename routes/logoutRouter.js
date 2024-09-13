import { Router } from "express";
import logoutAdmin from "../controllers/logoutController.js";

const router = Router();

router.post("/", logoutAdmin);

export default router;
