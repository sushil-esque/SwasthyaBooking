import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";

import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Login() {
  const [passVis, setPassvis] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit() {
    const loginJson = {
      email: email,
      password: password,
    };
    try {
      const rawData = await fetch("http://127.0.0.1:8000/api/login", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginJson),
      });
      if (!rawData.ok) {
        throw new Error("Login Failed!!!");
      }
      const data = await rawData.json();

      const { access_token, is_admin, user_id } = data;
      if (access_token) {
        alert("Login successful");
        localStorage.setItem("token", access_token);

        if (user_id) {
          localStorage.setItem("user_id", user_id);
          console.log("User ID stored:", user_id);
        } else {
          console.warn("User ID not found in response");
        }
      } else {
        window.alert("Bad credentials");
        console.warn("Access token not found in response");
       
      }
      navigate("/");
      // window.location.reload();
    } catch (error) {
      

      console.log("error fetching data");
    }
  }
  function showpw() {
    setPassvis(!passVis);
  }
  console.log(password);

  return (
    <div className="loginPageWrapper">
      <div className="loginPage">
        <div>
          <h2>Login</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="namePw">
            <label htmlFor="userName">Email </label>
            <div className="userInput">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="text"
                htmlFor="Username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="userName"
                placeholder="Type your email"
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                htmlFor="password"
                id="password"
                placeholder="Type your password"
              />
              <button onClick={showpw} type="button">
                {passVis ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <hr />
          </div>
          <button className="loginBtn" type="submit">
            Log in
          </button>
        </form>

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
