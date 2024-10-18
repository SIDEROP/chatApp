import { User } from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

// Get all users except the logged-in user
export const getAllUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user.userId;
  console.log(currentUserId);
  try {
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password",
    );
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve users")
  }
});



// Update username for the logged-in user and retrieve all other users
export const changenewUsername = asyncHandler(async (req, res) => {
  const currentUserId = req.user.userId;
  const { newUsername } = req.body;

  try {
    // Update the username if a new one is provided
    if (newUsername) {
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
        throw new ApiError(404, "User not found");
      }

      currentUser.username = newUsername;
      await currentUser.save();
    }

    // Retrieve all users except the logged-in user
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");

    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve users");
  }
});
