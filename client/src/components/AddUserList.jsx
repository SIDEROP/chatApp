import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserParticipants,
  getUserChat,
  setUserCrentId,
} from "../app/slices/chatSlice";
import { useSocketContext } from "../context/SocketContext";
import { isUserOnline } from "../utils/userOnline ";
import { setChatOpen } from "../app/slices/userSlice";


const AddUserList = ({ user }) => {
  const { onlineUsers } = useSocketContext();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserParticipants());
  }, [dispatch]);

  const handleUserClick = () => {
    dispatch(setChatOpen(false))
    if (user) {
      dispatch(getUserChat(user?._id));
      dispatch(setUserCrentId(user));
    }
  };

  let onlineStatus = isUserOnline(user?._id,onlineUsers)

  return (
    <div className="user" onClick={handleUserClick}>
      <div className="profile">
        <img src={user?.img} alt={`${user?.username}'s profile`} />
      </div>
      <div className="profileData">
        <h4>{user?.username}</h4>
        <p style={{ fontSize: "11px", textTransform: "uppercase" }}>
          {onlineStatus && onlineStatus?"Online":"Ofline"}
        </p>
      </div>
    </div>
  );
};

export default AddUserList;
