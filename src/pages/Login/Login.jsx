import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Login() {
  const [passVis, setPassvis] = useState(false);
  function showpw() {
    setPassvis(!passVis);
  }

  return (
    <div className="loginPageWrapper">
      <div className="loginPage">
        <div>
          <h2>Login</h2>
        </div>
        <div className="namePw">
          <label htmlFor="userName">Username </label>
          <div className="userInput">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              htmlFor="Username"
              id="userName"
              placeholder="Type your username"
            />
          </div>
          <hr />
        </div>
        <div className="namePw">
          <label htmlFor="password">Password </label>
          <div className="userInput">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={passVis ? "text" : "password"}
              htmlFor="password"
              id="password"
              placeholder="Type your password"
            />
            <button onClick={showpw}>
              {passVis ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
          <hr />
        </div>
        <button className="loginBtn">Log in</button>
        <NavLink to={"/signin"}>
          <div className="createAc" style={{ margin: "10px", color: "black" }}>
            Create an account
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Login;
