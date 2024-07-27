import Admin from "../models/AdminModel.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export async function registerAdmin(req, res, next) {
  const { email, password } = req.body;

  try {
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

    // admin.populate("blogPosts");

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

    // await foundAdmin.populate("blogPosts");

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

export async function createPost(req, res, next) {}
