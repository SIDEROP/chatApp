import React, { useEffect } from "react";
import "./css/chat.css";
import chatImg from "../assets/img/chatImg.png"
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SendMasseg from "../components/SendMasseg";
import SendMessageBox from "../components/SendMessageBox";
import rtcConnection from "../socket/rtcConnection";
import { useSocketContext } from "../context/SocketContext";
import { isUserOnline } from "../utils/userOnline ";
import { getNotification } from "../app/slices/chatSlice";
import { MdDeleteOutline } from "react-icons/md";
import { deleteMessageApi } from "../app/slices/messageSlice";

const Chat = () => {

  const typingUsers = useSelector((state) => state.chat.typingUsers || []);
  
  const { onlineUsers } = useSocketContext();
  const { chat, receiverIdUser } = useSelector(
    (state) => state.chat.getUserChat
  );
  const {chatOpen } = useSelector((state) => state.user);
  rtcConnection();

  let onlineStatus = isUserOnline(receiverIdUser?._id, onlineUsers);

  const {
    userNotifications: { notifications },
  } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotification());
  }, []);

  return (
    <>
      <div className="Chat">
        <div className="userList">
          <div className="container">
            <input
              type="text"
              name="text"
              className="input"
              placeholder="Search..."
            />
            <button className="search__btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
              >
                <path
                  d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
                  fill="#efeff1"
                ></path>
              </svg>
            </button>
          </div>

          <div className="userProfileList">
            <Outlet /> {/* Render nested routes */}
          </div>
        </div>
        <div className={`userChat ${chatOpen ? "active" : ""}`}>
          {receiverIdUser && (
            <div className="chatProfileHeader" > 
              <div className="chatProfile">
                <img src={receiverIdUser?.img} alt="User Avatar" />
                <div className="chatProfileData">
                  <h4
                    style={{
                      textTransform: "uppercase",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {receiverIdUser?.username}
                  </h4>
                  <p
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {onlineStatus && onlineStatus ? typingUsers.includes(receiverIdUser?._id)?"typing..":"Online" : "Ofline"}
                  </p>
                  
                </div>
              </div>
              <div>
                <i
                  className="delete"
                  onClick={() => {
                    dispatch(deleteMessageApi(receiverIdUser._id));
                  }}
                >
                  <MdDeleteOutline size={29} />
                </i>
              </div>
            </div>
          )}
          <div className="chatBox">
            {receiverIdUser && chat.length > 0 ? (
              chat.map((data) => <SendMasseg key={data._id} user={data} />)
            ) : (
              <div className="notiDivBox"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%"
                }}
              >
                <img
                  src={chatImg}
                  style={{ width: "60%",minWidth:"300px",maxWidth:"600px" }}
                  alt=""
                />
              </div>
            )}
          </div>
          {receiverIdUser && <SendMessageBox />}
        </div>
      </div>
    </>
  );
};

export default Chat;
