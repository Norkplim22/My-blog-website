import { Router } from "express";
import {
  uploadFile,
  uploadFileByUrl,
  createPost,
  publishPost,
  deletePost,
  getAllBlogPosts,
  getComments,
  addComment,
  approveComment,
  deleteComment,
  addReply,
  adminReply,
} from "../controllers/blogPostsController.js";
import upload from "../middlewares/multerConfig.js";
import { body } from "express-validator";

const router = Router();

router.post("/uploadFile", upload.single("file"), uploadFile);
router.post("/uploadFileByUrl", uploadFileByUrl);
router.post("/createPost/:id", upload.single("image"), createPost);
router.patch("/publishPost/:postId", publishPost);
router.delete("/deletePost/:postId", deletePost);

router.get("/getComments", getComments);
router.post(
  "/comments/addComments/:postId/",
  [body("name").escape().trim(), body("email").normalizeEmail().trim(), body("content").escape().trim()],
  addComment
);
router.post(
  "/comments/addReply/:postId/:commentId",
  [body("name").escape().trim(), body("email").normalizeEmail().trim(), body("content").escape().trim()],
  addReply
);
router.patch("/comments/approveComment/:postId/:commentId", approveComment);
router.delete("/comments/deleteComment/:postId/:commentId", deleteComment);
router.patch("/comments/adminReply/:postId/:commentId/:adminId", adminReply);

router.get("/getAllBlogPosts", getAllBlogPosts);

export default router;
