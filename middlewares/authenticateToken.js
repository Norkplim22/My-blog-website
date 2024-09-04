import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import createHttpError from "http-errors";

export async function authenticateToken(req, res, next) {
  try {
    const { adminAccessCookie, adminRefreshCookie } = req.cookies;

    if (!adminAccessCookie && !adminRefreshCookie) {
      throw new Error("Authentication required. Please log in.");
    }

    let token = adminAccessCookie;
    let isAccessToken = true;

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const foundAdmin = await Admin.findById(id);

      if (!foundAdmin) {
        throw new Error("Admin not found");
      }

      req.admin = foundAdmin;

      return next();
    } catch (error) {
      isAccessToken = false;
    }

    if (!isAccessToken && adminRefreshCookie) {
      console.log("admin access token expired");

      token = adminRefreshCookie;
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const foundAdmin = await Admin.findById(id);

      if (!foundAdmin) {
        throw new Error("Admin not found");
      }

      const newAccessToken = jwt.sign({ id: foundAdmin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 15,
      };

      res.cookie("adminAccessCookie", newAccessToken, cookieOptions);

      console.log("New admin access token created");

      req.admin = foundAdmin;

      return next();
    } else {
      throw new Error("Authentication required. Please log in.");
    }
  } catch (error) {
    next(createHttpError(401, error.message));
  }
}
