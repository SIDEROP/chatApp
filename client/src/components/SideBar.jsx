import React, { useEffect } from "react";
import "./css/sideBar.css";
import { Link } from "react-router-dom";
import { CiLogout, CiSettings } from "react-icons/ci";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { logOut } from "../app/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { setChatOpen, setProfileOpen } from "../app/slices/userSlice";
import { SiDarkreader } from "react-icons/si";

const SideBar = () => {
  const { authenticatData } = useSelector((state) => state.auth.reLogin);
  let dispatch = useDispatch();

  useEffect(() => {
    const activeElements = document.querySelectorAll("a.iBtn");
    activeElements.forEach((element) => {
      element.addEventListener("click", (ele) => {
        activeElements.forEach((e) => e.classList.remove("active"));
        element.classList.add("active");
      });
    });
  }, []);

  return (
    <div className="SideBar">
      <div className="logo">
        <img src="https://www.pngall.com/wp-content/uploads/10/Message-Logo-PNG-Photo.png" />
      </div>
      <div className="header">
        <div className="allIcons">
          <Link
            className="iBtn active"
            to="/"
            onClick={() => {
              dispatch(setChatOpen(true));
            }}
          >
            <i>
              <IoChatbubblesOutline fontSize={32} />
            </i>
          </Link>
          <Link
            className="iBtn"
            to="add"
            onClick={() => {
              dispatch(setChatOpen(true));
            }}
          >
            <i>
              <FaRegUser fontSize={32} />
            </i>
          </Link>
        </div>
        <div className="infoIcons">
          <Link to="profile" className="iBtn">
            <i
              onClick={() => {
                dispatch(setChatOpen(true));
              }}
            >
              <img
                className="authenticatDataProfile"
                src={authenticatData.img}
                alt=""
              />
            </i>
          </Link>
          <i className="userProfileStin">
            <CiLogout
              fontSize={32}
              onClick={() => {
                dispatch(logOut());
              }}
            />
          </i>
          <i
            className="mode"
            onClick={() => {
              document.body.classList.toggle("active");
            }}
          >
            <SiDarkreader fontSize={26} />
          </i>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
