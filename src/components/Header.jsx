import { toast } from "@/hooks/use-toast";
import {
  faChevronDown,
  faCircleChevronDown,
  faUser,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
function Header() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const token = localStorage.getItem("token");
const { logout } =  useContext(AuthContext);

  const handleLogout = () => {
   // window.alert("You are logged out");
    // window.location.reload();
    logout();

    toast({
      title: "You are logged out",
      description: "You have logged out successfully",
    })
  };

  return (
    <div className="headerMain">
      <div className="logo">
        <NavLink to={"/home"}>
        <img src="/logo.png" alt="logo" />
        </NavLink>
       
      </div>
      <div className="navigation">
        <nav>
          <ul>
            <li>
              <NavLink to={"/home"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/findDoctors"}>Find Doctor</NavLink>
            </li>
            {/* <li>
              <NavLink to={"/healthPackages"}>Health Packages</NavLink>
            </li> */}
            <li>
              <NavLink to={"/about"}>About</NavLink>
            </li>
            {token && (
              <li>
                <NavLink to={"/recommendedDoctors"}>Recommended Doctors</NavLink>
              </li>
            )}
         
          </ul>


          {token ? (
            //   <li onClick={handleLogout} >
            //     <button className="login">Logout </button>

            //   </li>
            <div>
              <div
                className="dropDown"
                style={{ display: "flex", gap: "5px" }}
                onClick={() => {
                  setIsActive(!isActive);
                }}
              >
                <FontAwesomeIcon icon={faUserAlt} />
                <div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
                {isActive && (
                  <div className="dropDownContent">
                    <NavLink to={"/UserDashboard"}>Dashboard</NavLink>
                    <hr />
                    <NavLink to={"/"} onClick={handleLogout}>
                      Logout
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <NavLink to={"/login"}>
              <button className="login">Login </button>
            </NavLink>
          )}

          {/* <li>
                            <NavLink to={"/signin"}>
                                <button className="signin">Sign In</button>
                            </NavLink>
                        </li> */}
                        {token &&(
                          <FaBell />
                        )
                        
                        }
        </nav>
      </div>
    </div>
  );
}

export default Header;
