import Admin from "../models/AdminModel.js";
import BlogPost from "../models/BlogPostModel.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export async function checkAuth(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return next(400, createHttpError("Admin not found, Authentication failed! Please login."));
    }

    admin.populate("blogPosts");

    res.status(201).json(admin);
  } catch (error) {}
}

export async function registerAdmin(req, res, next) {
  const { email, password } = req.body;

  try {
    // Check if there is already an admin in the system
    const adminExists = await Admin.findOne({});

    if (adminExists) {
      return next(createHttpError(403, "An admin already exists. Only one admin is allowed."));
    }

    const foundAdmin = await Admin.findOne({ email });

    if (foundAdmin) {
      return next(createHttpError(409, "Admin already exists"));
    }

    // Validate password strength here before hashing
    const isPasswordStrong = validator.isStrongPassword(password);

    if (!isPasswordStrong) {
      return next(
        createHttpError(
          400,
          "Password must contain at least 8 characters, including at least 1 lowercase character, 1 uppercase character, 1 number and 1 symbol"
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ ...req.body, password: hashedPassword });

    admin.populate("blogPosts");

    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    const accessOptions = {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    };

    const refreshOptions = {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    };

    res.cookie("adminAccessCookie", accessToken, accessOptions);
    res.cookie("adminRefreshCookie", refreshToken, refreshOptions);

    res.status(201).json(admin);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error creating an admin"));
  }
}

export async function loginAdmin(req, res, next) {
  const { email, password } = req.body;

  try {
    const foundAdmin = await Admin.findOne({ email });

    if (!foundAdmin) {
      return next(createHttpError(404, "No Admin found with the email"));
    }

    const matchingPasswords = await bcrypt.compare(password, foundAdmin.password);

    if (!matchingPasswords) {
      return next(createHttpError(400, "Wrong password, please try again!"));
    }

    await foundAdmin.populate("blogPosts");

    const accessToken = jwt.sign({ id: foundAdmin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: foundAdmin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    const accessOptions = {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    };

    const refreshOptions = {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    };

    res.cookie("adminAccessCookie", accessToken, accessOptions);
    res.cookie("adminRefreshCookie", refreshToken, refreshOptions);

    res.json(foundAdmin);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error logging in"));
  }
}

export async function addPost(req, res, next) {
  const { newPostId } = req.body;
  const { adminId } = req.params;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No admin found"));
    }

    const options = {
      new: true,
      runValidators: true,
    };

    foundAdmin.blogPosts = foundAdmin.blogPosts.filter((blogPost) => blogPost._id.toString() !== newPostId);

    await foundAdmin.save();

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { $push: { blogPosts: newPostId } }, options);

    await updatedAdmin.populate("blogPosts");

    res.json(updatedAdmin);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error adding post to admin"));
  }
}

export async function getAllPosts(req, res, next) {
  const { adminId } = req.params;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No admin found"));
    }

    await foundAdmin.populate("blogPosts");

    res.json(foundAdmin);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting all blog posts"));
  }
}

export async function deletePost(req, res, next) {
  const { adminId } = req.params;
  const { deletedPostId } = req.body;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No admin found"));
    }

    foundAdmin.blogPosts = foundAdmin.blogPosts.filter((blogPost) => blogPost._id.toString() !== deletedPostId);

    await foundAdmin.save();

    await foundAdmin.populate("blogPosts");

    res.json({ message: "The post has been deleted successfully", data: foundAdmin });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error deleting post from your blog posts"));
  }
}

export async function toggleFeatured(req, res, next) {
  const { postId, featured } = req.body;
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId).populate("featuredPosts");

    const post = await BlogPost.findById(postId);

    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }

    const isAlreadyFeatured = admin.featuredPosts.some((p) => p._id.toString() === postId);

    if (featured && !isAlreadyFeatured) {
      // If trying to feature and the post is not already featured
      if (admin.featuredPosts.length >= 3) {
        return next(createHttpError(400, "You can only have 3 featured posts"));
      }

      // Add post to featured
      admin.featuredPosts.push(postId);
      post.featured = true;
    } else if (!featured && isAlreadyFeatured) {
      // If trying to un-feature the post
      admin.featuredPosts = admin.featuredPosts.filter((p) => p._id.toString() !== postId);
      post.featured = false;
    } else {
      return next(createHttpError(400, "Invalid operation"));
    }

    await admin.save();
    await post.save();

    res.json({
      message: `Post has been ${featured ? "featured" : "removed from featured"}.`,
      updatedPost: post,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error toggling featuring post"));
  }
}

export async function updateProfile(req, res, next) {
  const { adminId } = req.params;
  const { formData } = req.body;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No admin found"));
    }

    if (formData.oldPassword && formData.newPassword) {
      const checkPasswords = await bcrypt.compare(formData.oldPassword, foundAdmin.password);

      if (!checkPasswords) {
        return next(createHttpError(400, "Wrong old password, please try again!"));
      }

      // Hash the new password if password change is requested
      formData.password = await bcrypt.hash(formData.newPassword, 10);
    } else {
      // Do not update password if not provided
      delete formData.password;
    }

    const options = {
      new: true,
      runValidators: true,
    };

    // const hashedPassword = await bcrypt.hash(formData.newPassword, 10);

    // Update the admin with the new data
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { $set: formData }, options).lean();

    // Exclude the password before sending the response
    delete updatedAdmin.password;

    res.json(updatedAdmin);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error updating your profile."));
  }
}

export async function addSubscribers(req, res, next) {
  const { email } = req.body;

  try {
    // Find the admin (assuming there's only one admin)
    const admin = await Admin.findOne({});

    if (!admin) {
      return next(createHttpError(404, "Admin not found"));
    }

    if (!email) {
      return next(createHttpError(400, "Please fill the email input."));
    }

    // Check if the email already exists in the subscribers array
    const isAlreadySubscribed = admin.subscribers.some((subscriber) => subscriber.email === email);

    if (isAlreadySubscribed) {
      return next(createHttpError(400, "This email is already subscribed"));
    }

    const options = {
      new: true,
      runValidators: true,
    };

    // Add the email object to the subscribers array
    await Admin.findByIdAndUpdate(
      admin._id,
      { $push: { subscribers: { email } } }, // Add the email as an object
      options
    );

    res.status(200).json({ message: "You have successfully subscribed!" });
  } catch (error) {
    // console.error(error);
    if (error.name === "ValidationError") {
      const errMessage = Object.values(error.errors)[0].message;
      console.log(errMessage);

      return next(createHttpError(400, errMessage));
    }
    return next(createHttpError(500, "Server error subscribing to the mailing list"));
  }
}

export async function getSubscribers(req, res, next) {
  const { adminId } = req.params;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No Admin found"));
    }

    const subscribers = foundAdmin.subscribers;

    res.json(subscribers);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting subscribers"));
  }
}

export async function deleteSubscriber(req, res, next) {
  const { adminId, subscriberId } = req.params;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No Admin found"));
    }

    foundAdmin.subscribers = foundAdmin.subscribers.filter((subscriber) => subscriber._id.toString() !== subscriberId);

    await foundAdmin.save();

    res.json({ message: "The subscriber has been deleted successfully", data: foundAdmin.subscribers });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error deleting the subscriber"));
  }
}

export async function getComments(req, res, next) {
  const { adminId } = req.params;

  try {
    const foundAdmin = await Admin.findById(adminId);

    if (!foundAdmin) {
      return next(createHttpError(404, "No Admin found"));
    }

    await foundAdmin.populate("blogPosts");

    const blogWithComments = foundAdmin.blogPosts
      .filter((blogPost) => blogPost.comments.length !== 0)
      .map((blogPost) => ({
        title: blogPost.title,
        comments: blogPost.comments,
        _id: blogPost._id,
      }));

    res.json(blogWithComments);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Server error getting comments"));
  }
}
