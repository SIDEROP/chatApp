import Chat from "../models/Chat.js";
import { Notification } from "../models/Notification.js";
import Message from "../models/Message.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { getReceiverSocketId } from "../sockets/chat.js";
import { io } from "../index.js";

// getUserChat
export const getUserChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { userId } = req.user;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  const chat = await Chat.findOne({
    participants: { $all: [userId, receiverId] },
  }).populate({
    path: "messages",
    populate: { path: "sender", select: "username" },
    options: { sort: { timestamp: 1 } },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const modifiedMessages = chat.messages.map((message) => ({
    ...message.toObject(),
    isSentByUser: message.sender._id.toString() === userId.toString(), // true if the sender is the current user
  }));

  const modifiedChat = {
    ...chat.toObject(),
    messages: modifiedMessages,
  };

  res
    .status(200)
    .json(new ApiResponse(200, modifiedChat, "Chat retrieved successfully"));
});




// Get chats user
export const getUserParticipants = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const chats = await Chat.find({
    participants: { $in: [userId] },
  })
    .populate({
      path: "participants",
      select: "-password -email -createdAt -updatedAt",
      options: { sort: { timestamp: 1 } },
    })
    .select("-messages");

  if (!chats || chats.length === 0) {
    throw new ApiError(404, "No chats found for this user");
  }

  const filteredChats = chats.map((chat) => ({
    ...chat.toObject(),
    participants: chat.participants.filter(
      (participant) => participant._id.toString() !== userId.toString(),
    ),
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        filteredChats,
        "All user chats retrieved successfully",
      ),
    );
});

// deleteParticipantAndMessages
export const deleteParticipantAndMessages = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { userId } = req.user;

  const chat = await Chat.findOne({
    participants: { $all: [userId, receiverId] },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  if (!chat.participants.includes(receiverId)) {
    throw new ApiError(404, "Participant not found in this chat");
  }

  chat.participants = chat.participants.filter(
    (participant) => participant.toString() !== receiverId,
  );

  await Message.deleteMany({
    _id: { $in: chat.messages },
    sender: receiverId,
  });

  await Chat.findByIdAndDelete(chat._id);
  await Notification.deleteMany({
    $and: [{ recipient: userId }, { sender: receiverId }],
  });

  // SOCKET IO FUNCTIONALITY
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("deleteParticipant", chat?.id);
    io.to(receiverSocketId).emit("deleteMessage", userId);
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        chat,
        "Participant and their messages removed, and chat deleted successfully",
      ),
    );
});
