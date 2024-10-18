import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserParticipants } from "../app/slices/chatSlice";
import UserList from "../components/UserList";
import AddNewMessage from "../components/AddNewMessage";
import Loader from "../components/Loader";

const ChatUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserParticipants());
  }, [dispatch]);
  const { participants, loading, error } = useSelector(
    (state) => state.chat.getUserParticipants
  );

  return (
    <>
      {loading && (
        <p
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </p>
      )}
      {error && (
        <p
          className="error"
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddNewMessage />
        </p>
      )}
      {participants.map((user, i) => (
        <UserList key={user._id} user={user?.participants} i={i} />
      ))}
    </>
  );
};

export default ChatUser;
