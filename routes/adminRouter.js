import { Router } from "express";
import { registerAdmin, loginAdmin, addPost, checkAuth } from "../controllers/adminController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.use(authenticateToken);
router.get("/check-auth", checkAuth);
router.patch("/addPost/:adminId", addPost);

export default router;
