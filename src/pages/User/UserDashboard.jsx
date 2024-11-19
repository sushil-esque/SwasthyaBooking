import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import "./user.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faHeart, faKey, faUserCog } from "@fortawesome/free-solid-svg-icons";

function UserDashboard() {
  const [data, setData] = useState({});

  async function fetchUser() {
    const token = localStorage.getItem("token");
    try {
      const rawData = await fetch("http://127.0.0.1:8000/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!rawData.ok) {
        throw new Error("error fetching data");
      }
      const data = await rawData.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="userMenu">
      <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"5px"}}>
      <div className="userMenuImageContainer">
        <img
          src={data.image_url}
          alt="UserProfilePic"
          
        />
      </div>
      <div className="userMenuProfileName">
        <h3>{data.name}</h3>
      </div>
      </div>
     
      <div className="userMenuContent">
        <ul>
          <li>
            <NavLink
              to="appointments"
            >
              <FontAwesomeIcon icon={faCalendarAlt} />Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="favorite"
            >
              <FontAwesomeIcon icon={faHeart} /> Favorite
            </NavLink>
          </li>
          <li>
            <NavLink
              to="profileSettings"
            >
              <FontAwesomeIcon icon={faUserCog} /> Profile Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="changePassword"
            >
              <FontAwesomeIcon icon={faKey} /> Change Password
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserDashboard;
