import React, { useEffect, useState } from "react";
import "./css/userList.css"
import { useDispatch, useSelector } from "react-redux";
import {
  getUserParticipants,
  getUserChat,
  setUserCrentId,
  deleteNotification,
  deleteParticipantAndMessagesApi
} from "../app/slices/chatSlice";
import { useSocketContext } from "../context/SocketContext";
import { isUserOnline } from "../utils/userOnline ";
import {
  countMatchingNotifications,
  findMatchingNotificationIds,
  isUserIdInNotifications,
} from "../utils/isUserIdInNotifications ";
import { setChatOpen } from "../app/slices/userSlice";
import { deleteNotificationApi } from "../app/slices/notificationSlice";
import { MdDeleteOutline } from "react-icons/md";

const UserList = ({ user }) => {
  const typingUsers = useSelector((state) => state.chat.typingUsers || []);
  const { chat, receiverIdUser } = useSelector(
    (state) => state.chat.getUserChat
  );
  const { notifications } = useSelector(
    (state) => state.chat.userNotifications
  );

  const { onlineUsers } = useSocketContext();
  const [newUser, setNewUser] = useState(user[0] || null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserParticipants());
  }, [dispatch]);

  let receiverIdUserDot = isUserIdInNotifications(
    notifications,
    receiverIdUser?._id
  );
  let noti = isUserIdInNotifications(notifications, newUser?._id);
  let onlineStatus = isUserOnline(newUser?._id, onlineUsers);

  let notiLength = countMatchingNotifications(notifications, newUser?._id);

  const handleUserClick = () => {
    dispatch(setChatOpen(false));
    if (newUser) {
      dispatch(getUserChat(newUser._id));
      dispatch(setUserCrentId(newUser));
    }
  };

  useEffect(() => {
    if (noti) {
      dispatch(
        deleteNotificationApi(
          findMatchingNotificationIds(notifications, receiverIdUser?._id)
        )
      ).then(() => {
        dispatch(deleteNotification(receiverIdUser?._id));
      });
    }
  }, [noti, receiverIdUserDot]);


  return (
    <div className={`user ${receiverIdUser?._id == newUser?._id? "active":null}`} onClick={handleUserClick}>
      <p className="line"></p>
      <div className="profile">
        <img src={newUser?.img} alt={`${newUser?.username}'s profile`} />
      </div>
      <div className="profileData">
        <h4>{newUser?.username}</h4>
        <p style={{ fontSize: "11px" }}>
        {onlineStatus && onlineStatus ? typingUsers.includes(newUser?._id)?"typing..":"Online" : "Ofline"}
        </p>
        {receiverIdUserDot ? null : noti ? (
          <p
            className="dot active"
            a={notifications && notifications ? notiLength : null}
          ></p>
        ) : null}
      </div>
      <div className="deleteParti">
        <i
          className="delete"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteParticipantAndMessagesApi(newUser?._id));
          }}
        >
          <MdDeleteOutline size={23} />
        </i>
      </div>
    </div>
  );
};

export default UserList;
