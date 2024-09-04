import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

router.get("/", authenticateToken);

export default router;
