import { User } from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// Register a new user
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((data) => !data || data.length === 0)) {
    res
      .status(400)
      .json({ error: "All fields (username, email, password) are required" });
    // throw new ApiError(
    //   400,
    //   "All fields (username, email, password) are required",
    // );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ error: "User already exists" });
    // throw new ApiError(400, "User already exists");
  }

  // Generate the image URL based on the username
  const img = `https://avatar.iran.liara.run/username?username=${username}&bold=false&length=1`;

  const newUser = new User({ username, email, password, img });
  await newUser.save();

  generateToken(res, newUser._id);

  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User registered successfully"));
});

// Login a user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((data) => !data || data.length === 0)) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ error: "Invalid email or password" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(400).json({ error: "Invalid email or password" });
  }

  generateToken(res, user._id);
  res.status(200).json(new ApiResponse(200, user, "Login successful"));
});

// Logout a user
export const logout = asyncHandler(async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const tokenFromCookie = req.cookies.token;
    if (
      (!authHeader || authHeader.length === 0) &&
      (!tokenFromCookie || tokenFromCookie.length === 0)
    ) {
      throw new ApiError(400, "Invalid or missing token in header or cookie");
    }
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });

    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    throw new ApiError(500, "Error during logout");
  }
});


// Handle re-login
export const reLogin = asyncHandler(async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : req.cookies.token;

  if (!token) {
    throw new ApiError(
      401,
      "Token is missing from Authorization header or cookies",
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const tokenExpireTime = jwt.decode(token).exp;
    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenExpireTime < currentTime) {
      throw new ApiError(401, "Token has expired. Please login again.");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User authenticated successfully"));
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired. Please login again.");
    }

    if (err.name === "JsonWebTokenError") {
      throw new ApiError(403, "Invalid token");
    }

    throw new ApiError(500, "Internal server error");
  }
});
