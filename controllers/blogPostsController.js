import BlogPost from "../models/BlogPostModel.js";
import createHttpError from "http-errors";
import cloudinary from "../middlewares/cloudinaryConfig.js";

export async function uploadFile(req, res, next) {
  try {
    if (req.file) {
      const cloudImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "/blog-website",
      });

      if (!cloudImage) {
        return next(createHttpError(400, "File size is too large. File size should be less than 2MB"));
      }

      res.json({
        success: 1,
        file: {
          url: cloudImage.secure_url,
        },
      });
    }
  } catch (error) {
    return next(createHttpError(500, "Server error uploading image"));
  }
}

export async function uploadFileByUrl(req, res, next) {
  const { url } = req.body;
  try {
    const cloudImage = await cloudinary.uploader.upload(url, {
      folder: "/blog-website",
    });

    if (!cloudImage) {
      return next(createHttpError(400, "File size is too large. File size should be less than 2MB"));
    }

    res.json({
      success: 1,
      file: {
        url: cloudImage.secure_url,
      },
    });
  } catch (error) {
    return next(createHttpError(500, "Server error uploading image url"));
  }
}

export async function createPost(req, res, next) {
  const { id } = req.params;
  const { postId } = req.body;
  let imageUrl;
  try {
    if (req.file) {
      const cloudImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "/blog-website",
      });

      if (!cloudImage) {
        return next(createHttpError(400, "File size is too large. File size should be less than 2MB"));
      }

      imageUrl = cloudImage.secure_url;
    }

    let post;

    if (postId) {
      post = await BlogPost.findByIdAndUpdate(
        postId,
        { ...req.body, coverImage: imageUrl || req.body.coverImage }, // If no new image is uploaded, keep the old one
        { new: true, runValidators: true }
      );
      if (!post) {
        return next(createHttpError(404, "Post not found"));
      }
    } else {
      post = await BlogPost.create({ ...req.body, coverImage: imageUrl, author: id });
    }
    console.log(post);

    res.json({ newPostId: post._id, newPost: post });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error creating post"));
  }
}

export async function publishPost(req, res, next) {
  const { postId } = req.params;
  const { published } = req.body;

  try {
    const foundBlogPost = await BlogPost.findById(postId);

    if (!foundBlogPost) {
      return next(createHttpError(404, "No post found"));
    }

    foundBlogPost.published = published;
    await foundBlogPost.save();

    res.json({ message: "You post has been published successfully" });
  } catch (error) {
    console.error(error);
    return next(500, "Server error publishing post");
  }
}

export async function deletePost(req, res, next) {
  const { postId } = req.params;

  try {
    const deletedPost = await BlogPost.findByIdAndDelete(postId);

    if (!deletedPost) {
      return next(createHttpError(404, "No Post found to delete "));
    }

    res.json({ deletedPostId: deletedPost._id });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error deleting the blog post"));
  }
}

export async function getAllBlogPosts(req, res, next) {
  try {
    const blogPosts = await BlogPost.find({ published: true }).sort({ updatedAt: -1 });

    if (!blogPosts) {
      return next(createHttpError(404, "No blog posts found"));
    }

    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting all blogPosts for publishing"));
  }
}
