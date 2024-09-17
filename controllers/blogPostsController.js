import BlogPost from "../models/BlogPostModel.js";
import Admin from "../models/AdminModel.js";
import Comment from "../models/CommentModel.js";
import createHttpError from "http-errors";
import cloudinary from "../middlewares/cloudinaryConfig.js";
import he from "he";

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
    // console.log(post);

    res.json({ newPostId: post._id, newPost: post });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error creating post"));
  }
}

export async function publishPost(req, res, next) {
  const { postId } = req.params;
  const { string } = req.body;

  try {
    const foundBlogPost = await BlogPost.findById(postId);

    if (!foundBlogPost) {
      return next(createHttpError(404, "No post found"));
    }

    if (string === "publish") {
      foundBlogPost.published = true;
    }

    if (string === "unpublish") {
      foundBlogPost.published = false;
    }

    // foundBlogPost.published = published;
    await foundBlogPost.save();

    res.json({ message: `You post has been ${foundBlogPost.published ? "published" : "unpublished"} successfully` });
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
    const blogPosts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        match: { approved: true }, // Only get approved comments
        populate: {
          path: "replies",
          match: { approved: true }, // Only get approved replies
        },
      });

    if (!blogPosts) {
      return next(createHttpError(404, "No blog posts found"));
    }

    // Unescape the comments and replies
    const unescapedBlogPosts = blogPosts.map((blogPost) => {
      const unescapedComments = blogPost.comments.map((comment) => {
        const unescapedReplies = comment.replies.map((reply) => {
          // Use reply as a plain object if toObject method doesn't exist
          const replyObj = reply.toObject ? reply.toObject() : reply;

          return {
            ...replyObj,
            content: he.unescape(replyObj.content ?? ""), // Unescape reply content
          };
        });

        const commentObj = comment.toObject ? comment.toObject() : comment;

        return {
          ...commentObj,
          content: he.unescape(commentObj.content ?? ""), // Unescape comment content
          replies: unescapedReplies, // Set the unescaped replies
        };
      });

      return {
        ...blogPost.toObject(),
        comments: unescapedComments, // Set the unescaped comments
      };
    });

    res.json(unescapedBlogPosts);

    // res.json(blogPosts);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting all blogPosts for publishing"));
  }
}

export async function getComments(req, res, next) {
  try {
    const posts = await BlogPost.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: { path: "replies" }, // To populate nested replies
      });

    if (!posts) {
      return next(createHttpError(404, "Blog posts not found"));
    }

    // Unescape the comments and replies
    const unescapedBlogPosts = posts.map((blogPost) => {
      const unescapedComments = blogPost.comments.map((comment) => {
        const unescapedReplies = comment.replies.map((reply) => {
          // Use reply as a plain object if toObject method doesn't exist
          const replyObj = reply.toObject ? reply.toObject() : reply;

          return {
            ...replyObj,
            content: he.unescape(replyObj.content ?? ""), // Unescape reply content
          };
        });

        const commentObj = comment.toObject ? comment.toObject() : comment;

        return {
          ...commentObj,
          content: he.unescape(commentObj.content ?? ""), // Unescape comment content
          replies: unescapedReplies, // Set the unescaped replies
        };
      });

      return {
        ...blogPost.toObject(),
        comments: unescapedComments, // Set the unescaped comments
      };
    });

    const blogWithComments = unescapedBlogPosts
      .filter((blogPost) => blogPost.comments.length !== 0)
      .map((blogPost) => {
        return {
          title: blogPost.title,
          comments: blogPost.comments,
          _id: blogPost._id,
        };
      });

    res.json(blogWithComments);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting comments"));
  }
}

// Add a new comment
export async function addComment(req, res, next) {
  const { postId } = req.params;
  const { name, email, content } = req.body;

  try {
    if (!name || !email || !content) {
      return next(createHttpError(400, "All inputs must be filled."));
    }
    const post = await BlogPost.findById(postId);

    if (!post) {
      return next(createHttpError(404, "Blog post not found"));
    }

    // Create a new Comment document
    const newComment = new Comment({
      name,
      email,
      content,
      approved: false, // Set approved to false until the admin approves it
    });

    // Save the new comment
    await newComment.save();

    // Push the new comment's _id into the blog post's comments array
    post.comments.push(newComment._id);

    // Save the updated blog post
    await post.save();

    res.status(200).json({ message: "Comment added successfully, pending approval by the admin" });
  } catch (error) {
    // console.error(error);
    if (error.name === "ValidationError") {
      const errMessage = Object.values(error.errors)[0].message;
      console.log(errMessage);

      return next(createHttpError(400, errMessage));
    }
    return next(createHttpError(500, "Server error adding comment", error.message));
  }
}

// Add a reply to a comment
export async function addReply(req, res, next) {
  const { postId, commentId } = req.params;
  const { name, email, content } = req.body;

  try {
    const post = await BlogPost.findById(postId).populate("comments");

    if (!post) {
      return next(createHttpError(404, "Blog post not found"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(createHttpError(404, "Comment not found"));
    }

    // Create a new Comment document for the reply
    const newReply = new Comment({
      name,
      email,
      content,
      approved: false, // Set approved to false until the admin approves it
    });

    // Save the reply
    await newReply.save();

    // Push the new reply's _id into the replies array of the comment
    comment.replies.push(newReply._id);

    // Save the updated comment
    await comment.save();

    res.status(200).json({ message: "Reply added successfully, pending approval from the admin" });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error adding reply"));
  }
}

// Approve a comment
export async function approveComment(req, res, next) {
  const { postId, commentId } = req.params;
  const { isApproved } = req.body;

  try {
    const post = await BlogPost.findById(postId).populate("comments");

    if (!post) {
      return next(createHttpError(404, "Blog post not found"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(createHttpError(404, "Comment not found"));
    }

    // Set the approved flag to true for the comment
    comment.approved = isApproved;

    // Save the updated comment
    await comment.save();

    const blogPosts = await BlogPost.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: { path: "replies" }, // To populate nested replies
      });

    // Unescape the comments and replies
    const unescapedBlogPosts = blogPosts.map((blogPost) => {
      const unescapedComments = blogPost.comments.map((comment) => {
        const unescapedReplies = comment.replies.map((reply) => {
          // Use reply as a plain object if toObject method doesn't exist
          const replyObj = reply.toObject ? reply.toObject() : reply;

          return {
            ...replyObj,
            content: he.unescape(replyObj.content ?? ""), // Unescape reply content
          };
        });

        const commentObj = comment.toObject ? comment.toObject() : comment;

        return {
          ...commentObj,
          content: he.unescape(commentObj.content ?? ""), // Unescape comment content
          replies: unescapedReplies, // Set the unescaped replies
        };
      });

      return {
        ...blogPost.toObject(),
        comments: unescapedComments, // Set the unescaped comments
      };
    });

    const blogWithComments = unescapedBlogPosts
      .filter((blogPost) => blogPost.comments.length !== 0)
      .map((blogPost) => {
        return {
          title: blogPost.title,
          comments: blogPost.comments,
          _id: blogPost._id,
        };
      });

    res.status(200).json({ message: `Comment ${isApproved ? "approved" : "disapproved"}`, data: blogWithComments });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error approving comment"));
  }
}

// Delete a comment
export async function deleteComment(req, res, next) {
  const { postId, commentId } = req.params;
  const { replyId } = req.body;

  try {
    const post = await BlogPost.findById(postId).populate("comments");

    if (!post) {
      return next(createHttpError(404, "Blog post not found"));
    }

    if (replyId) {
      // This means we are trying to delete a reply to a comment
      const parentComment = post.comments.find((comment) => comment._id.toString() === commentId);

      if (!parentComment) {
        return next(createHttpError(404, "Parent comment not found"));
      }

      // Find and remove the specific reply from the replies array
      parentComment.replies = parentComment.replies.filter((reply) => reply._id.toString() !== replyId);

      await post.save();

      // Delete the reply document from the Comment collection
      await Comment.findByIdAndDelete(replyId);
    } else {
      // This means we are deleting a top-level comment
      post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);

      await post.save();

      // Delete the comment document from the Comment collection
      await Comment.findByIdAndDelete(commentId);
    }

    const blogPosts = await BlogPost.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: { path: "replies" }, // To populate nested replies
      });

    // Unescape the comments and replies
    const unescapedBlogPosts = blogPosts.map((blogPost) => {
      const unescapedComments = blogPost.comments.map((comment) => {
        const unescapedReplies = comment.replies.map((reply) => {
          // Use reply as a plain object if toObject method doesn't exist
          const replyObj = reply.toObject ? reply.toObject() : reply;

          return {
            ...replyObj,
            content: he.unescape(replyObj.content ?? ""), // Unescape reply content
          };
        });

        const commentObj = comment.toObject ? comment.toObject() : comment;

        return {
          ...commentObj,
          content: he.unescape(commentObj.content ?? ""), // Unescape comment content
          replies: unescapedReplies, // Set the unescaped replies
        };
      });

      return {
        ...blogPost.toObject(),
        comments: unescapedComments, // Set the unescaped comments
      };
    });

    const blogWithComments = unescapedBlogPosts
      .filter((blogPost) => blogPost.comments.length !== 0)
      .map((blogPost) => {
        return {
          title: blogPost.title,
          comments: blogPost.comments,
          _id: blogPost._id,
        };
      });

    res.status(200).json({ message: "Comment deleted", data: blogWithComments });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error deleting comment"));
  }
}

export async function adminReply(req, res, next) {
  const { adminReplyInput } = req.body;
  const { postId, commentId, adminId } = req.params;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No Admin found"));
    }

    const post = await BlogPost.findById(postId).populate({
      path: "comments",
      populate: { path: "replies" }, // To populate nested replies
    });

    if (!post) {
      return next(createHttpError(404, "Blog post not found"));
    }

    // Find the comment by its id
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(createHttpError(404, "Comment not found"));
    }

    // Create a new Comment document for the reply
    const newReply = new Comment({
      name: foundAdmin.firstname,
      email: foundAdmin.email,
      content: adminReplyInput,
      approved: true, // Admin replies are approved by default
      role: "Admin",
    });

    // Save the reply to the Comment collection
    await newReply.save();

    // Push the new reply's _id into the replies array of the comment
    comment.replies.push(newReply._id);

    // Save the updated comment with the new reply
    await comment.save();

    await comment.populate("replies");

    res.json({ message: "Your reply was successful", data: newReply });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error replying to the user's comment"));
  }
}

export async function getPost(req, res, next) {
  const { postId } = req.params;

  try {
    const foundPost = await BlogPost.findById(postId).populate({
      path: "comments",
      match: { approved: true }, // Only get approved comments
      populate: {
        path: "replies",
        match: { approved: true }, // Only get approved replies
      },
    });

    if (!foundPost) {
      return next(createHttpError(404, "Blog post not found"));
    }

    // Unescape the comments and replies
    const unescapedComments = foundPost.comments.map((comment) => {
      const unescapedReplies = comment.replies.map((reply) => {
        const replyObj = reply.toObject ? reply.toObject() : reply;

        return {
          ...replyObj,
          content: he.unescape(replyObj.content ?? ""), // Unescape reply content
        };
      });

      const commentObj = comment.toObject ? comment.toObject() : comment;

      return {
        ...commentObj,
        content: he.unescape(commentObj.content ?? ""), // Unescape comment content
        replies: unescapedReplies, // Set the unescaped replies
      };
    });

    const unescapedPost = {
      ...foundPost.toObject(),
      comments: unescapedComments, // Set the unescaped comments
    };

    res.json(unescapedPost);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting the blog post"));
  }
}
