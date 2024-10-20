import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { io } from "../index.js";
import { getReceiverSocketId } from "../sockets/chat.js";
import { encrypt, decrypt } from "../utils/crypto.js";

// sendMessage
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;
  const { userId } = req.user;
  let encr = encrypt(content);

  if (!receiverId || !content) {
    throw new ApiError(400, "Receiver ID and content are required");
  }
  let chatPrev = false;

  let chat = await Chat.findOne({
    participants: { $all: [userId, receiverId] },
  });

  if (!chat) {
    chatPrev = true;
    chat = new Chat({
      participants: [userId, receiverId],
      messages: [],
    });
    await chat.save();
  }

  const message = new Message({
    chat: chat._id,
    sender: userId,
    content,
    status: "sent",
  });

  chat.messages.push(message._id);
  await Promise.all([message.save(), chat.save()]);

  if (chatPrev) {
    newparticipants(userId, receiverId);
  }

  const modifiedMessagesUser = {
    ...message.toObject(),
    isSentByUser: message.sender._id.toString() === userId.toString(),
  };

  const modifiedMessagesReceiver = {
    ...message.toObject(),
    isSentByUser: false,
  };

  // Update chat with modified messages
  const modifiedChatReceiver = {
    messages: modifiedMessagesReceiver,
  };
  const modifiedChat = {
    messages: modifiedMessagesUser,
  };

  // SOCKET IO FUNCTIONALITY
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", modifiedChatReceiver.messages);
  }

  const userSocketId = getReceiverSocketId(userId);
  if (userSocketId) {
    io.to(userSocketId).emit("userNewMessage", modifiedChat.messages);
  }

  // Create notification for the receiver
  const notification = new Notification({
    recipient: receiverId,
    sender: userId,
    message: "You have a new message",
    type: "message",
  });
  await notification.save();

  if (notification) {
    const notifications = await Notification.findById(notification?._id)
      .sort({ createdAt: -1 })
      .populate("sender", "username");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", notifications);
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, { message, chat }, "Message sent successfully"));
});

// deleteMessage
export const deleteMessage = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { receiverId } = req.params;

  const chat = await Chat.findOne({
    participants: { $all: [userId, receiverId] },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const messageCount = chat.messages.length;

  if (messageCount === 0) {
    throw new ApiError(404, "No messages to delete");
  }

  await Message.deleteMany({ _id: { $in: chat.messages } });

  chat.messages = [];
  await chat.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedMessages: messageCount },
        "Messages deleted successfully",
      ),
    );
  // SOCKET IO FUNCTIONALITY
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("deleteMessage", userId);
  }
});

// utils RTC contr

let newparticipants = async (userId, receiverId) => {
  const chats = await Chat.find({
    participants: { $in: [userId, receiverId] },
  })
    .populate({
      path: "participants",
      select: "-password -email -createdAt -updatedAt",
      options: { sort: { timestamp: 1 } },
    })
    .select("-messages");

  if (chats) {
    const filteredChats = chats.map((chat) => ({
      ...chat.toObject(),
      participants: chat.participants.filter(
        (participant) => participant._id.toString() !== receiverId.toString(),
      ),
    }));

    const receiverIdSocket = getReceiverSocketId(receiverId);

    if (receiverIdSocket) {
      io.to(receiverIdSocket).emit("participants", filteredChats);
    }
  }
};
