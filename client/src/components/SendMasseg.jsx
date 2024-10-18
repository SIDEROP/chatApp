import React, { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/formatTime ";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
const SendMasseg = ({ user }) => {
  let [shouldShake, setShouldShake] = useState(user?.shouldShake);
  const { chat, receiverIdUser, loading } = useSelector(
    (state) => state.chat.getUserChat
  );
  
  useEffect(() => {
    setTimeout(() => {
      setShouldShake(false);
    }, 1000);
  }, [user?.shouldShake]);

  const usrefrens = useRef();

  useEffect(() => {
    if (usrefrens.current) {
      usrefrens.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
  }, [user]);

  let time = formatTime(user?.createdAt);
  return (
    <>
      {loading && (
        <p
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </p>
      )}
      <div
        className={`sendMasseg ${shouldShake ? "active" : ""}`}
        style={
          user?.isSentByUser
            ? { justifyContent: "end" }
            : { justifyContent: "start" }
        }
        ref={usrefrens}
      >
        <p className="send">
          <p>{user?.content}</p>
          <p
            className="time"
            style={
              user?.isSentByUser
                ? { right: "7px", bottom: "-15px" }
                : { left: "7px", bottom: "-15px" }
            }
          >
            {<p>{time}</p>}
          </p>
        </p>
      </div>
    </>
  );
};

export default SendMasseg;
