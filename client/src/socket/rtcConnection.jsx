import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";

import notificationSound from "../assets/sounds/notifi.wav";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserChat,
  getNotification,
  setDeleteParticipant,
  setNotifications,
  setTypingUsers,
  setUserChat,
  setUserParticipants,
} from "../app/slices/chatSlice";
import { isUserIdInNotifications } from "../utils/isUserIdInNotifications ";
import { userChatFilterRecever } from "../utils/getLastChatContent";

const updateTypingUsers = (typingUsers, userStatus) => {
  const { senderId, isTyping } = userStatus;

  if (isTyping && !typingUsers.includes(senderId)) {
    typingUsers.push(senderId);
  } else if (!isTyping && typingUsers.includes(senderId)) {
    typingUsers.splice(typingUsers.indexOf(senderId), 1);
  }
};

const rtcConnection = () => {
  const { socket } = useSocketContext();
  let usedis = useDispatch();

  const { chat } = useSelector((state) => state.chat.getUserChat);
  const typingUsers = useSelector((state) => state.chat.typingUsers || []);


  useEffect(() => {
    // newMessage
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      let userChatRecever = userChatFilterRecever(chat, newMessage?.chat);
      if (userChatRecever) {
        usedis(setUserChat([...chat, newMessage]));
      }
    });
    socket?.on("deleteMessage", (deleteMessage) => {
      if (deleteMessage) {
        usedis(deleteUserChat(deleteMessage));
      }
    });

    // Handle typing notification
    socket?.on("typing", (userStatus) => {
      const updatedTypingUsers = [...typingUsers];
      updateTypingUsers(updatedTypingUsers, userStatus);
      usedis(setTypingUsers(updatedTypingUsers));
    });

    // userNewMessage
    socket?.on("userNewMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      usedis(setUserChat([...chat, newMessage]));
    });

    // notification
    socket?.on("notification", (newMessage) => {
      newMessage.shouldShake = true;
      usedis(setNotifications(newMessage));
    });

    // participants
    socket?.on("participants", (participants) => {
      participants.shouldShake = true;
      if (participants) {
        usedis(setUserParticipants(participants[0]));
      }
    });
    socket?.on("deleteParticipant", (deleteParticipant) => {
      if (deleteParticipant) {
        usedis(setDeleteParticipant(deleteParticipant));
      }
    });
    return () => (
      socket?.off("newMessage"),
      socket?.off("userNewMessage"),
      socket?.off("deleteMessage"),
      socket?.off("notification"),
      socket?.off("participants"),
      socket?.off("deleteMessage"),
      socket?.off("typing")
    );
  }, [socket, setUserChat, chat]);
};
export default rtcConnection;
