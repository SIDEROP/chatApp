import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../app/slices/messageSlice";
import { getUserParticipants } from "../app/slices/chatSlice";
import "./css/sendMessageBox.css";
import { useSocketContext } from "../context/SocketContext"; // Import SocketContext to use socket

const SendMessageBox = () => {
  const { receiverIdUser } = useSelector((state) => state.chat.getUserChat);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.message.sendMessage);
  const { socket } = useSocketContext(); // Access the socket from context
  const typingTimeoutRef = useRef(null); // Ref to handle typing timeout

  const handleTyping = (receiverId, isTyping) => {
    if (socket && receiverId) {
      socket.emit("typing", { receiverId, isTyping });
    }
  };

  const handleInputChange = (e) => {
    setContent(e.target.value);

    if (e.target.value.trim()) {
      handleTyping(receiverIdUser?._id, true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(receiverIdUser?._id, false);
      }, 2000);
    } else {
      handleTyping(receiverIdUser?._id, false); 
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(sendMessage({ receiverId: receiverIdUser?._id, content })).then(
        () => {
          dispatch(getUserParticipants());
        }
      );
      setContent("");
      handleTyping(receiverIdUser?._id, false); // Emit stop typing when message is sent
    }
  };

  return (
    <form className="sendMessageBox" onSubmit={handleSendMessage}>
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label htmlFor="file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 337 337"
            >
              <circle
                strokeWidth="20"
                stroke="#6c6c6c"
                fill="none"
                r="158.5"
                cy="168.5"
                cx="168.5"
              ></circle>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M167.759 79V259"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M79 167.138H259"
              ></path>
            </svg>
            <span className="tooltip">Add</span>
          </label>
          <input type="file" id="file" name="file" />
        </div>
        <input
          required=""
          placeholder="Message..."
          type="text"
          id="messageInput"
          value={content}
          onChange={handleInputChange}
          disabled={loading}
        />
        <button id="sendButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 664 663"
          >
            <path
              fill="none"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="33.67"
              stroke="#6c6c6c"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SendMessageBox;
