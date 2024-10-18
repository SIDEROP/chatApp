import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

import {
  userStatusOfline,
  userStatusOnline,
} from "./controllers/user.contr.io.js";

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

const chatSocketHandler = (io, socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  userStatusOnline(Object.keys(userSocketMap));

  // Handle typing event
  socket.on("typing", ({ receiverId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId, isTyping });
    }
  });

  socket.on("disconnect", () => {
    userStatusOfline(Object.keys(userSocketMap));
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
};

export default chatSocketHandler;
