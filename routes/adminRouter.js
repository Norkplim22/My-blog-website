import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  addPost,
  checkAuth,
  getAllPosts,
  deletePost,
  toggleFeatured,
  updateProfile,
  addSubscribers,
  getSubscribers,
  deleteSubscriber,
  getComments,
} from "../controllers/adminController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { body } from "express-validator";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/subscribers/addSubscribers", [body("email").normalizeEmail().trim()], addSubscribers);

router.use(authenticateToken);
router.get("/check-auth", checkAuth);
router.patch("/addPost/:adminId", addPost);
router.get("/getAllPosts/:adminId", getAllPosts);
router.patch("/deletePost/:adminId", deletePost);
router.post("/toggleFeatured/:adminId", toggleFeatured);
router.post("/profile/:adminId", updateProfile);
router.get("/getSubscribers/:adminId", getSubscribers);
router.delete("/deleteSubscriber/:adminId/:subscriberId", deleteSubscriber);
router.get("/getComments/:adminId", getComments);

export default router;
