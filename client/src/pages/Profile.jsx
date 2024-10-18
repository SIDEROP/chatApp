import React from "react";
import "./css/profile.css"
import { useSelector } from "react-redux";

const Profile = () => {
  const { authenticatData } = useSelector(
    (state) => state.auth.reLogin
  );
  return (
    <div className="Profile">
      <aside class="profile-card">
        <header>
          <a href="#">
            <img src={authenticatData.img} />
          </a>

          <h3 style={{textTransform:"uppercase"}}>{authenticatData.username}</h3>
        </header>

        <div class="profile-bio">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti a maiores amet totam sunt corporis quaerat est distinctio provident quam
          </p>
        </div>

      </aside>
    </div>
  );
};

export default Profile;
