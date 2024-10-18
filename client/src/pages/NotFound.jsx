import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  let [auth, setAuth] = useState(false);
  let useNav = useNavigate()
  useEffect(()=>{
    useNav("/")
  },[])
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
