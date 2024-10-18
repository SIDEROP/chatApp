import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { User } from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : req.cookies.token;
    if (!token) {
      throw new ApiError(
        401,
        "Token is missing from Authorization header or cookies",
      );
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        throw new ApiError(403, "Invalid or expired token");
      }
      const foundUser = await User.findById(user.userId);
      if (!foundUser) {
        throw new ApiError(404, "User not found");
      }
      req.user = user;
      
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default auth;
