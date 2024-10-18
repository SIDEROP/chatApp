import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import Login from "./pages/Login";
import AddUser from "./pages/AddUser";
import Chat from "./pages/Chat";
import ChatUser from "./pages/ChatUser";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { reLogin } from "./app/slices/authSlice";
import Profile from "./pages/Profile";
import toast,{Toaster} from "react-hot-toast";

const App = () => {
  const {
    reLogin: { loading, error, authenticat },
  } = useSelector((state) => state.auth); // Access nested state
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reLogin());
  }, []);

  return (
    <>
      {authenticat ? <SideBar /> : <></>}
      <Routes>
        {authenticat ? (
          <>
            <Route path="/" element={<Chat />}>
              <Route path="/" element={<ChatUser />} />
              <Route path="/add" element={<AddUser />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path="signup" element={<SignUp />} />
            <Route path="/" element={<Login />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster/>
    </>
  );
};

export default App;
