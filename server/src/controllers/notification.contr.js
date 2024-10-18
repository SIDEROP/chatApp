import { Notification } from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

// Create a new notification
export const createNotification = asyncHandler(async (req, res) => {
  const { recipient, message, type } = req.body;
  const sender = req.user._id; 

  if (!recipient || !message || !type) {
    throw new ApiError(400, "Recipient, message, and type are required");
  }

  const notification = new Notification({
    recipient,
    sender,
    message,
    type,
  });

  await notification.save();

  res
    .status(201)
    .json(
      new ApiResponse(201, notification, "Notification created successfully"),
    );
});



// Get all notifications for a user
export const getNotifications = asyncHandler(async (req, res) => {
  const {userId} = req.user; 
  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "username");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notifications,
        "Notifications retrieved successfully",
      ),
    );
});



export const deleteNotification = asyncHandler(async (req, res) => {

  const { notificationId } = req.body;
  if (!notificationId) {
    throw new ApiError(400, "Notification ID is required");
  }

  if (Array.isArray(notificationId)) {
    const result = await Notification.deleteMany({
      _id: { $in: notificationId },
    });

    if (result.deletedCount === 0) {
      throw new ApiError(404, "No notifications found with the provided IDs");
    }
  } else {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }
  }

  res.status(200).json(new ApiResponse(200, null, "Notification(s) deleted successfully"));
});