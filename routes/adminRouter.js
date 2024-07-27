import { Router } from "express";
import { registerAdmin, loginAdmin, createPost } from "../controllers/adminController.js";
import upload from "../middlewares/multerConfig.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/createPost", upload.single("image"), createPost);

export default router;
