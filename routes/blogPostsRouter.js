import { Router } from "express";
import { uploadFile, uploadFileByUrl, createPost, publishPost } from "../controllers/blogPostsController.js";
import upload from "../middlewares/multerConfig.js";

const router = Router();

router.post("/uploadFile", upload.single("file"), uploadFile);
router.post("/uploadFileByUrl", uploadFileByUrl);
router.post("/createPost/:id", upload.single("image"), createPost);
router.patch("/publishPost/:postId", publishPost);

export default router;
